const mongoose = require('mongoose');
const bankSchema = new mongoose.Schema({
    types: Array,
    name: String,
    geometry: {
        coordinates: Array
    }
},{collection: 'bank'});

bankSchema.statics.getGeowithin = function(geometry){
    var bankPoints = this.find({
        'geometry.coordinates':{
            $geoWithin: {
                $geometry: geometry
            }
        }
    }).then((data) => {
        return data;
    });
    return bankPoints;
}

bankSchema.statics.getPointsInCircle = async function(center, radius){
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

bankSchema.index({
    geometry: "2dsphere"
})

const POI_modifiedDB = mongoose.connection.useDb('POI_modified');
module.exports = POI_modifiedDB.model('bank',bankSchema);