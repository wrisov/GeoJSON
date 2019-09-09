const mongoose = require('mongoose');
const clothingStoreSchema = new mongoose.Schema({
    types: Array,
    name: String,
    geometry: {
        coordinates: Array
    }
},{collection: 'clothing_store'});

clothingStoreSchema.statics.getGeowithin = function(geometry){
    var clothingStorePoints = this.find({
        'geometry.coordinates':{
            $geoWithin: {
                $geometry: geometry
            }
        }
    }).then((data) => {
        return data;
    });
    return clothingStorePoints;
}

clothingStoreSchema.statics.getPointsInCircle = async function(center, radius){
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

clothingStoreSchema.index({
    geometry: "2dsphere"
})

const POI_modifiedDB = mongoose.connection.useDb('POI_modified');
module.exports = POI_modifiedDB.model('clothing_store',clothingStoreSchema);