const mongoose = require('mongoose');
const townVillageSchema = mongoose.Schema({
    area: String,
    educational: Number,
    medical: Number,
    finance: Number,
    level: String,
    households: Number,
    areaInHectares: Number,
    geometry: {
        coordinates: Array
    },
    population: {
        total: Number,
        male: Number,
        female: Number,
        sc: Number,
        st: Number
    },
    parent_shape_id: Number,
    name: String
}, {"collection": "TownVillage"});

townVillageSchema.statics.getGeowithin = async function(geometry){
    var townsVillages = this.find({
        'geometry.coordinates': {
            $geoWithin: {
                $geometry: geometry
            }
        }
    }).then((data) => {
        return data;
    })
    return townsVillages;
};

const ShapefilesDB = mongoose.connection.useDb('Shapefiles');
module.exports = ShapefilesDB.model('TownVillage', townVillageSchema);