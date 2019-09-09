var mongoose = require('mongoose');
var hoponSchema = new mongoose.Schema({
    jumps: Number,
    fromTime: Date,
    stop: {
        stopId: String,
        stopName: String,
        count: Number
    },
    toTime: Date,
    day: String
}, {collection: 'hopon'});

hoponSchema.statics.getHoponPointsInCricle = async function(stops, filter){
    var filter = filter ? filter : {};
    var fromTime = filter.fromTime ? new Date(1563993000000 + 3600000 * filter.fromTime) : new Date(978307200000);
    var toTime = filter.toTime ? new Date(1563993000000 + 3600000 * filter.toTime) : new Date(32472144000000);
    var hoponPoints = await Promise.all(stops.map(async (eachstop) => {
        var eachHoponPoint = this.find({
            'stop.stopId': eachstop.stopId
        }).gte('fromTime', fromTime).lte('toTime', toTime);
        return eachHoponPoint;
    }));
    return hoponPoints;
};

const PathadishaDB = mongoose.connection.useDb('Pathadisha');
module.exports = PathadishaDB.model('hopon', hoponSchema);