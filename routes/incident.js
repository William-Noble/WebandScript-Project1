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
        res.render('incident/incident',{
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
})
router.post('/add',async(req,res,next)=>{
    try{
        let newIncident = Book({
            "Name":req.body.Name,
            "Author":req.body.Author,
            "Published":req.body.Published,
            "Description":req.body.Description,
            "Price":req.body.Price
        });
        Book.create(newIncident).then(()=>{
            res.redirect('/incidentList');
        })
    }
    catch(err)
    {
        console.error(err);
        res.render('incident/IncidentList',{
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
        let updatedIncident = incidentModel({
            "_id":id,
            "Name":req.body.Name,
            "Author":req.body.Author,
            "Published":req.body.Published,
            "Description":req.body.Description,
            "Price":req.body.Price
        });
        incidentModel.findByIdAndUpdate(id,updatedIncident).then(()=>{
            res.redirect('/incidentList')
        })
    }
    catch(err){
        console.error(err);
        res.render('incident/incidentList',{
            error:'Error on the server'
        })
    }
});

router.get('/delete/:id',async(req,res,next)=>{
    try{
        let id=req.params.id;
        incidentModel.deleteOne({_id:id}).then(()=>{
            res.redirect('/incidentList')
        })
    }
    catch(err){
        console.error(err);
        res.render('incident/incidentList',{
            error:'Error on the server'
        })
    }
});
module.exports = router;