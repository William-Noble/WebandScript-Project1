var express = require('express');
var router = express.Router();

const passport = require('passport');
const DB = require('../config/db');
userModel = require('../model/user');
let User = userModel.User;
let indexController = require('../controllers/index');

/* GET index page. */
router.get('/', indexController.displayHomePage);

router.get('/home', indexController.displayHomePage);

router.get('/login', indexController.displayLoginPage);

router.post('/login', indexController.processLoginPage);

router.get('/register', indexController.displayRegisterPage);

router.post('/register', indexController.processRegisterPage);

router.get('/logout', indexController.performLogout);

module.exports = router;
