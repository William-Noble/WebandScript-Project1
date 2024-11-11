// MVC --> Model , View , Controller (Routers)
let mongoose = require('mongoose')
// create a model class
let incidentModel = mongoose.Schema({
    type: String,
    time: String,
    location: String,
    involvedParties: String,
    overview: String,
    damages: String,
    state: String
},
{
    collection: "incidentReports"
}
)
module.exports = mongoose.model('Incident', incidentModel)