const mongoose = require('mongoose');
const pathdisha_routes_schema = new mongoose.Schema({
    modified_by : String,
    distance : Number,
    UpDn : String,
    id : String,
    modified_at : String,
    fromStopId : String,
    time : String,
    created_by : String,
    toStopId : String,
    routeCode : String,
    created_at : String
 }, {collection: 'routes'});

 pathdisha_routes_schema.statics.getRoutesInCircle = async function(stops) {
    var routes = await Promise.all(stops.map(async (stop) => {
        var route = this.find().or([
            {fromStopId: stop.stopId},
            {toStopId: stop.stopId}
        ]);
        return route;
    }));
    console.log(routes);
    var uniqueRoutes = new Set();
    await Promise.all(routes.map((eachCircle) => {
        eachCircle.map(async (eachRoute) => {
            if(eachRoute.distance > 0)
                uniqueRoutes.add(eachRoute.fromStopId+eachRoute.toStopId);
        })
    }));
    console.log(uniqueRoutes);
    return uniqueRoutes.size;
 };

 const PathadishaDB = mongoose.connection.useDb('Pathadisha');
 module.exports = PathadishaDB.model('PathdishaRoutes', pathdisha_routes_schema)