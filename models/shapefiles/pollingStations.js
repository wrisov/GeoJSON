var mongoose = require('mongoose');
var pollingStationsSchema = mongoose.Schema({
    area: String,
    parent_id: Number,
    totalVoters: Number,
    acName: String,
    psName: String,
    geometry: {
        coordinates: Array,
    }
}, {"collection": "PollingStations"});

pollingStationsSchema.statics.getGeoWithinPolls = function(geometry) {
    pollingStation = this.find({
        "geometry.coordinates": {
            $geoWithin: {
                $geometry: geometry
            }
        }
    }).then((data) => {
        return data;
    });
    return pollingStation;
};

pollingStationsSchema.statics.getPointsInCircle = async function(center, radius) {
    var result = await this.find({
        geometry: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: center
                },
                $maxDistance: radius
            }
        }
    }).then((data) => {
        return data;
    })
    return result;
}

const ShapefilesDB = mongoose.connection.useDb('Shapefiles');
module.exports = ShapefilesDB.model('PollingStations',pollingStationsSchema);
