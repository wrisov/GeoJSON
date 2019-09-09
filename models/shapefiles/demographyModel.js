var mongoose = require('mongoose');

var demographySchema = mongoose.Schema({
    geometry:{
        coordinates: Array,
    },
    properties: {
        population: Number,
        bengali: Number,
        oriya: Number,
        tamil: Number,
        hindi: Number,
        kannada: Number,
        punjabi: Number,
        telugu: Number,
        malayalam: Number,
        sindhi: Number,
        marathi: Number,
        gujarati: Number,
        marwari: Number,
        assamese: Number,
        urdu: Number,
        Female_35_50: Number,
        Female_18_25: Number,
        Female_50_70: Number,
        Female_70_100: Number,
        Female_25_35: Number,
        Male_35_50: Number,
        Male_18_25: Number,
        Male_50_70: Number,
        Male_70_100: Number,
        Male_25_35: Number
    }
}, {collection: 'demography'});

demographySchema.statics.getGeowithinData = async function(geometry){
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

demographySchema.statics.getGeointersectData = async function(geometry){
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
module.exports = ShapeFilesDB.model('demographyModel', demographySchema);