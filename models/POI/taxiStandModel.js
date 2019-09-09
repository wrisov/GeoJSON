const mongoose = require('mongoose');
const taxiStandSchema = new mongoose.Schema({
    types: Array,
    name: String,
    geometry: {
        coordinates: Array
    }
},{collection: 'taxi_stand'});

taxiStandSchema.statics.getGeowithin = function(geometry){
    var taxiStandPoints = this.find({
        'geometry.coordinates':{
            $geoWithin: {
                $geometry: geometry
            }
        }
    }).then((data) => {
        return data;
    });
    return taxiStandPoints;
}

taxiStandSchema.statics.getPointsInCircle = async function(center, radius){
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

taxiStandSchema.index({
    geometry: "2dsphere"
});

const POI_modifiedDB = mongoose.connection.useDb('POI_modified');
module.exports = POI_modifiedDB.model('taxi_stand',taxiStandSchema);