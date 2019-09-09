const mongoose = require('mongoose');
const gasStationSchema = new mongoose.Schema({
    types: Array,
    name: String,
    geometry: {
        coordinates: Array
    }
},{collection: 'gas_station'});


gasStationSchema.statics.getGeowithin = function(geometry){
    var gasStationPoints = this.find({
        'geometry.coordinates':{
            $geoWithin: {
                $geometry: geometry
            }
        }
    }).then((data) => {
        return data;
    });
    return gasStationPoints;
}

gasStationSchema.statics.getPointsInCircle = async function(center, radius){
    var points = await this.find({
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
    });
    return points;
}

gasStationSchema.index({
    geometry: "2dsphere"
});

const POI_modifiedDB = mongoose.connection.useDb('POI_modified');
module.exports = POI_modifiedDB.model('gas_station', gasStationSchema);