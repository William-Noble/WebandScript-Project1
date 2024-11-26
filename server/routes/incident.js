var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let incidentModel = require('../model/incident')
let incidentController = require('../controllers/incident.js')

// checks if the user is logged in and if not sends them to the log in page
function requireAuth(req,res,next)
{
	if(!req.isAuthenticated())
	{
		return res.redirect('/login');
	}
	next();
}

/* Read Operation --> Get route for displaying the incidents list */
router.get('/',incidentController.displayIncidentslist)

/* Create Operation --> Get route for displaying the Add Page */
router.get('/add',requireAuth,incidentController.displayAddPage);
/* Create Operation --> Post route for processing the Add Page */
router.post('/add',requireAuth,incidentController.processAddPage);

/* Update Operation --> Get route for displaying the Edit Page */
router.get('/edit/:id',requireAuth,incidentController.displayEditPage);
/* Update Operation --> Post route for processing the Edit Page */ 
router.post('/edit/:id',requireAuth,incidentController.processEditPage);

/* Delete Operation --> Get route to perform Delete Operation */
router.get('/delete/:id',requireAuth,incidentController.performDelete);

//export :)
module.exports = router;