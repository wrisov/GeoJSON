const mongoose = require('mongoose');
const shape_schema = new mongoose.Schema({
    shape_id : Number,
    type: String,
    level: String,
    area:Number,
    coordinates : Array,
    name : String,
    parent_shape_id : Number,
    created_at: String,
    created_by : String,
    modified_at : String,
    modified_by : String,
    
},{collection : 'Shapes'});

module.exports = mongoose.model('Shapes',shape_schema);