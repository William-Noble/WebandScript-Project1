var express = require('express');
var router = express.Router();

const passport = require('passport');
const DB = require('../config/db');
userModel = require('../model/user');
let User = userModel.User;
let indexController = require('../controllers/index');

/* GET HOME page. */
module.exports.displayHomePage = (req, res, next) => {
    res.render('index', { title: 'Home' });
};

/* GET incident page. */
// router.get('/incidentList', function (req, res, next) {
//     res.render('./incident/add.ejs', { title: 'Incidents' });
// });

/* GET LOGIN page. */
module.exports.displayLoginPage = (req, res, next) => {
    res.render('./Auth/login.ejs', {
        title: 'Login',
        message: req.flash('loginMessage') || '',
        displayName: req.user ? req.user.displayName : ''
    });
};
module.exports.processLoginPage = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err)
        }
        if (!user) {
            req.flash('loginMessage', 'Authentication Error');
            return res.redirect('/login');
        }
        req.login(user, (err) => {
            if (err) {
                return next(err)
            }
            return res.redirect('/incidentslist');
        })
    })
};

/* GET REGISTER page. */
module.exports.displayRegisterPage = (req, res, next) => {
    if (!req.user) {
        res.render('Auth/register', {
            title: 'Register',
            message: req.flash('registerMessage'),
            displayName: req.user ? req.user.displayName : ''
        })
    }
    else {
        return res.redirect('/')
    }
    res.render('./Auth/register.ejs', {
        title: 'Register',
        message: req.flash('registerMessage')
    });
};
module.exports.processRegisterPage = (req, res, next) => {
    let newUser = new User({
        username: req.body.username,
        //password:req.boy.password,
        email: req.body.email,
        displayName: req.body.displayName
    })

    User.register(newUser, req.body.password, (err) => {
        if (err) {
            console.log("Error:Inserting the new User");
            if (err.name == "UserExistError") {
                req.flash('registerMessage', 'Registration Error: User already exists')
            }
            return res.render('Auth/register', {
                title: 'Register',
                message: req.flash('registerMessage'),
                displayName: req.user ? req.user.displayName : ''
            });
        }
        else {
            return passport.authenticate('local')(req, res, () => {
                res.redirect('/')
            })
        }
    })
};
module.exports.performLogout = (req, res, next) => {
    req.logOut(function (err) {
        if (err) {
            return next(err);
        }
    })
    res.redirect('/')
};
