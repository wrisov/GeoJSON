const mongoose = require('mongoose');
const pathdisha_vehicle_schema = new mongoose.Schema({
    agencyName : String,
    modified_by : String,
    vehicleType : String,
    created_by : String,
    modified_at : String,
    vehicleRegNo : String,
    routeCode : String,
    created_at : String,
    vehicleId : String
}, {collection: 'vehicle'});
const PathadishaDB = mongoose.connection.useDb('Pathadisha');
module.exports = PathadishaDB.model('PathdishaVechicle',pathdisha_vehicle_schema);
