// MVC --> Model , View , Controller (Routers)
let mongoose = require('mongoose')
// create a model class
let incidentModel = mongoose.Schema({
    type: String,
    time: String,
    location: String,
    witnesses: String,
    overview: String,
    statements: String,
    damages: String,
    state: String,
    notes: String,
    actionTaken: String,
    involvedParties: String
},
{
    collection: "incidentReports"
}
)
module.exports = mongoose.model('Incident', incidentModel)