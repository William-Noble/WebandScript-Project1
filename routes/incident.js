var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let Incident = require('../model/incident')
router.get('/',async(req,res,next)=>{
    try{
        const IncidentList = await Incident.find();
        res.render('incident',{
            title:'Incidents',
            IncidentList:IncidentList
        })
    }
    catch(err){
        console.error(err)
        res.render('incident',{
            error:'Error on Server'})
    }
})
module.exports = router;