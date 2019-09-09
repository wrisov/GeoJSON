const mongoose = require('mongoose');
const shape_schema = new mongoose.Schema({
    shape_id: Number,
    type: String,
    level: String,
    area: Number,
    coordinates: Array,
    name: String,
    parent_shape_id: Number,
    created_at: String,
    created_by: String,
    modified_at: String,
    modified_by: String,

}, {
    collection: 'Shapes'
});
const ShapefilesDB = mongoose.connection.useDb('Shapefiles');

shape_schema.statics.getCoordinates = async function(dict) {
    var coords = await this.findOne({name: dict.name, level: dict.level}).then((data) => {
        return data.coordinates;
    });
    return coords;
};

shape_schema.statics.getGeometry = async function(dict) {
    var geometry = await this.findOne({name: dict.name, level: dict.level}).then((data) => {
        return {
            type: data.type,
            coordinates: data.coordinates
        };
    });
    return geometry;
};


module.exports = ShapefilesDB.model('Shapes', shape_schema);