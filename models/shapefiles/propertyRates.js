var mongoose = require('mongoose');
var propertyRatesSchema = mongoose.Schema({
    properties: {
        rate: Number
    },
    geometry: {
        coordinates: Array
    }
}, {"collection": "PropertyRates"});

propertyRatesSchema.statics.getPropertyRatesGeoWithin = function(geometry) {
    var response = this.find({
        "geometry.coordinates": {
            $geoWithin: {
                $geometry: geometry
            }
        }
    }).then((data) => {
        return data;
    });
    return response;
}

propertyRatesSchema.statics.getPointsInCircle = async function(center, radius) {
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

propertyRatesSchema.index({
    point: "2dsphere"
});

const ShapefilesDB = mongoose.connection.useDb('Shapefiles');
module.exports = ShapefilesDB.model('propertyRatesModel', propertyRatesSchema);