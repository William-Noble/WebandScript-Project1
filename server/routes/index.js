var express = require('express');
var router = express.Router();

const passport = require('passport');
const DB = require('../config/db');
userModel = require('../model/user');
let User = userModel.User;
let indexController = require('../controllers/index');

/* GET index page. */
router.get('/', indexController.displayHomePage);
/* GET index page. */
router.get('/home', indexController.displayHomePage);
/* GET Login page. */
router.get('/login', indexController.displayLoginPage);
/* POST Login page. */
router.post('/login', indexController.processLoginPage);
// send user to GitHub for authentication
router.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }));
// authenticate github response
router.get('/auth/github/callback', 
    passport.authenticate('github', { failureRedirect: '/login' }), // if authentication fails redirect back to login
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
});
// router.get('/auth/google',
//     passport.authenticate('google', { scope: ['profile'] }));
  
// router.get('/auth/google/callback', 
//     passport.authenticate('google', { failureRedirect: '/login' }),
//     function(req, res) {
//         // Successful authentication, redirect home.
//         res.redirect('/');
// });

/* GET Register page. */
router.get('/register', indexController.displayRegisterPage);
/* POST Register page. */
router.post('/register', indexController.processRegisterPage);
/* perform Logout operation. */
router.get('/logout', indexController.performLogout);

module.exports = router;
