const mongoose = require('mongoose');
const pathdisha_route_schema = new mongoose.Schema({
    modified_by : String,
    startStop : String,
    routeId : String,
    created_by : String,
    modified_at : String,
    endStop : String,
    routeShortName : String,
    created_at : String,
    hasPaths : String
 }, {collection: 'route'});
 const PathadishaDB = mongoose.connection.useDb('Pathadisha');
 module.exports = PathadishaDB.model('route', pathdisha_route_schema)