var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let incidentModel = require('../model/incident')
router.get('/',async(req,res,next)=>{
    try{
        const IncidentList = await incidentModel.find();
        res.render('incident/incidentList',{
            title:'Incidents',
            IncidentList:IncidentList
        })
    }
    catch(err){
        console.error(err)
        res.render('incident/incidentList',{
            error:'Error on Server'})
    }
})
router.get('/add',async(req,res,next)=>{
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
});
router.post('/add',async(req,res,next)=>{
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
});

router.get('/edit/:id',async(req,res,next)=>{
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
});
router.post('/edit/:id',async(req,res,next)=>{
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
});

router.get('/delete/:id',async(req,res,next)=>{
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
});
module.exports = router;