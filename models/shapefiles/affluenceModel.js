var mongoose = require('mongoose');

var affluenceSchema = mongoose.Schema({
    geometry:{
        coordinates: Array,
    },
    properties: {
        landrate: Number,
    }
}, {collection: 'affluence'});

affluenceSchema.statics.getGeowithinData = async function(geometry){
    var allPoints = await this.find({
        geometry:{
            $geoWithin: {
                $geometry: geometry
            }
        }
    }).then((data) => {
        return data;
    });
    return allPoints;
};

affluenceSchema.statics.getGeointersectData = async function(geometry){
    var allPoints = await this.find({
        geometry:{
            $geoIntersects: {
                $geometry: geometry
            }
        }
    }).then((data) => {
        return data;
    });
    return allPoints;
};

const ShapeFilesDB = mongoose.connection.useDb('Shapefiles');
module.exports = ShapeFilesDB.model('affluenceModel', affluenceSchema);