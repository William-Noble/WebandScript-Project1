var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');

// telling my router that I have this model
let Incident = require('../model/incident');

// function for displaying the incidents list
module.exports.displayIncidentslist = async (req,res,next)=>{
    try{
        const IncidentList = await Incident.find();
        res.render('incident/incidentList',{
            title:'Incidents',
            displayName: req.user ? req.user.displayName:'',
            IncidentList:IncidentList
        })
    }
    catch(err){
        console.error(err)
        res.render('incident/incidentList',{
            title:'Incidents',
            displayName: req.user ? req.user.displayName:'',
            error:'Error on Server',
        })
    }
};

// function for displaying the add page
module.exports.displayAddPage = (req,res,next)=>{
    try{
        res.render('incident/add',{
            title: 'Add New Incident'
        })
    }
    catch(err)
    {
        console.error(err);
        res.render('incident/incidentList',{
            error:'Error on the server'
        })
    }
};

// function for processing the post operation for the add page
module.exports.processAddPage = (req,res,next)=>{
    try{
        let newIncident = incidentModel({
            "type":req.body.type,
            "time":req.body.time,
            "location":req.body.location,
            "involvedParties":req.body.involvedParties,
            "overview":req.body.overview,
            "damages":req.body.damages,
            "state":req.body.state
        });
        incidentModel.create(newIncident).then(()=>{
            res.redirect('/incidents');
        })
    }
    catch(err)
    {
        console.error(err);
        res.render('/incidents',{
            error:'Error on the server'
        })
    }
};

// function for displaying the edit page
module.exports.displayEditPage = async (req,res,next)=>{
    try{
        const id = req.params.id;
        const incidentToEdit= await incidentModel.findById(id);
        res.render('incident/edit',
            {
                title:'Edit Incident',
                incidentModel:incidentToEdit
            }
        )
    }
    catch(err)
    {
        console.error(err);
        next(err); // passing the error
    }
};

// function for processing the post operation on the edit page
module.exports.processEditPage = async (req,res,next)=>{
    try{
        let id=req.params.id;
        let updatedIncident = {
            "type":req.body.type,
            "time":req.body.time,
            "location":req.body.location,
            "involvedParties":req.body.involvedParties,
            "overview":req.body.overview,
            "damages":req.body.damages,
            "state":req.body.state
        };
        await incidentModel.findByIdAndUpdate(id,updatedIncident).then(()=>{
            res.redirect('/incidents')
        })
    }
    catch(err){
        console.error(err);
        res.render('/incidents',{
            error:'Error on the server'
        })
    }
};

// function for performing the delete operation
module.exports.performDelete = (req,res,next)=>{
    try{
        let id=req.params.id;
        incidentModel.deleteOne({_id:id}).then(()=>{
            res.redirect('/incidents')
        })
    }
    catch(err){
        console.error(err);
        res.render('/incidents',{
            error:'Error on the server'
        })
    }
};