require('dotenv').config()

let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

// require dependencies for passport-local
let session = require('express-session');
let passport = require('passport');
let passportLocal = require('passport-local');
// very important line below !!!
let localStrategy = passportLocal.Strategy;
var GitHubStrategy = require('passport-github2').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
let flash = require('connect-flash');

let indexRouter = require('../routes/index');
let usersRouter = require('../routes/users');
let incidentRouter = require('../routes/incident')

let app = express();
let mongoose = require('mongoose');
let DB = require('./db');
// point my mongoose to the URI
mongoose.connect(DB.URI);
let mongoDB = mongoose.connection;
mongoDB.on('error',console.error.bind(console,'Connection Error'))
mongoDB.once('open',()=>{
  console.log('MongoDB Connected')
})
mongoose.connect(DB.URI,{useNewUrlParser:true,useUnifiedTopology:true})

// create session
app.use(session({
	secret:"SomeSecret",
	saveUninitialized: false,
	resave: false
}))

let cors = require('cors')
let userModel = require('../model/user');
let User = userModel.User;

//implement a User Authentication
passport.use(User.createStrategy());
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // check if email is being given
    let email = '';
    if (profile.emails && profile.emails.length > 0) {
      email = profile.emails[0].value; // assign github email to email variable if it is set
    }
    // use username as backup if displayname does not exist
    let displayName = profile.displayName || profile.username

    // check if the user account has already been created
    let user = await User.findOne({ githubId: profile.id }); // https://stackoverflow.com/questions/20431049/what-is-function-user-findorcreate-doing-and-when-is-it-called-in-passport

    // if user has not been found, create a new user
    if (!user) {
      user = await User.create({
        githubId: profile.id, // get profile id from github
        username: profile.username, // get github username
        displayName: displayName || 'no-displayName', // use display name or fall back to no-displayname
        email: email || 'no-email', // user github email or fallback on no-email
      });
    }
    return done(null, user); // return the user (created or found)
  } catch (err) {
    return done(err); // return the error if there is an issue with teh user
  }
}));


// to scared to delete this right now
// function(accessToken, refreshToken, profile, done) {
//   User.findOrCreate({ githubId: profile.id }, function (err, user) {
//     return done(err, user);
//   });
// }
//));

// attempt at google authentication, TODO
// passport.use(new GoogleStrategy({
//   clientID: GOOGLE_CLIENT_ID,
//   clientSecret: GOOGLE_CLIENT_SECRET,
//   callbackURL: "http://www.example.com/auth/google/callback"
// },
// function(accessToken, refreshToken, profile, cb) {
//   User.findOrCreate({ googleId: profile.id }, function (err, user) {
//     return cb(err, user);
//   });
// }
// ));


// serialize/deserialize user information
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//initialize the flash
app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/incidents',incidentRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error',{title:'Error'});
});

module.exports = app;
