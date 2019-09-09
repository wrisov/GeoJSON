var mongoose = require('mongoose');

var satelliteSchema = mongoose.Schema({
    geometry: {
        coordinates: Array,
    },
    properties: {
        Roads: Number,
        "Open Ground": Number,
        "Water": Number,
        "Buildings": Number,
        "Vegetation": Number,
        "Commercial": Number,
        
    }
}, {collection: 'classifications'});

satelliteSchema.statics.getGeoWithinSatellitesWithFilters = async function(geometry) {
    var allSatellitePoints = await this.find({
        geometry: {
            $geoWithin: {
                $geometry: geometry
            }
        }
    }).then((data) => {
        return data;
    });
    return allSatellitePoints;
};

satelliteSchema.statics.getGeoIntersectSattelitesData = async function(geometry) {
    var allSatellitePoints = await this.find({
        geometry: {
            $geoIntersects: {
                $geometry: geometry
            }
        }
    }).then((data) => {
        return data;
    });
    return allSatellitePoints;
}

const ShapefilesDB = mongoose.connection.useDb('Shapefiles');
module.exports = ShapefilesDB.model('satelliteModel', satelliteSchema);