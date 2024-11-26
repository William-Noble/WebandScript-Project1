var express = require('express');
var router = express.Router();

/* GET index page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});
/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Home' });
});
/* GET about us page. */
router.get('/incidentList', function(req, res, next) {
  res.render('./incident/add.ejs', { title: 'Incidents' });
});

module.exports = router;
