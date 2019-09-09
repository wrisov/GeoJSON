const mongoose = require('mongoose');

let connections = require('../../services/mongoMultipleDb');

const pathdisha_approach_schema = new mongoose.Schema({
    distanceToReach : Number,
    modified_by : String,
    UpDn : String,
    id : String,
    modified_at : String,
    speed : Number,
    fromStopId: String,
    created_by : String,
    toStopId : String,
    routeCode : String,
    timeToReach : Number,
    created_at : String,
    vehicleId : String,
    time :{
        date : String
    }
}, {collection: 'approach'});
const PathadishaDB = mongoose.connection.useDb('Pathadisha');
module.exports = PathadishaDB.model('approach',pathdisha_approach_schema);
