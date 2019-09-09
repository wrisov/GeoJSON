const mongoose = require('mongoose');
const departmentStoreSchema = new mongoose.Schema({
    types: Array,
    name: String,
    geometry: {
        coordinates: Array
    }
},{collection: 'department_store'});

departmentStoreSchema.statics.getGeowithin = function(geometry){
    var departmentStorePoints = this.find({
        'geometry.coordinates':{
            $geoWithin: {
                $geometry: geometry
            }
        }
    }).then((data) => {
        return data;
    });
    return departmentStorePoints;
}

departmentStoreSchema.statics.getPointsInCircle = async function(center, radius){
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

departmentStoreSchema.index({
    geometry: "2dsphere"
});

const POI_modifiedDB = mongoose.connection.useDb('POI_modified');
module.exports = POI_modifiedDB.model('department_store',departmentStoreSchema);