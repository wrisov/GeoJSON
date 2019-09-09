const mongoose = require('mongoose');
const atmSchema = new mongoose.Schema({
    types: Array,
    name: String,
    geometry: {
        coordinates: Array
    }
},{collection: 'atm'});

atmSchema.statics.getGeowithin = async function(geometry){
    var atmPoints = this.find({
        'geometry.coordinates':{
            $geoWithin: {
                $geometry: geometry
            }
        }
    }).then((data) => {
        return data;
    });
    return atmPoints;
}

atmSchema.statics.getPointsInCircle = async function(center, radius){
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
};

atmSchema.index({
    geometry: "2dsphere"
});

const POI_modifiedDB = mongoose.connection.useDb('POI_modified');
module.exports = POI_modifiedDB.model('atm', atmSchema);