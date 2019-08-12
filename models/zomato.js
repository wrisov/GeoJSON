const mongoose = require('mongoose');

const zomato_schema = new mongoose.Schema({
    votes : Number,
    locality :String,
    cuisines : Array,
    'Most Popular' :Array,
    name : String,
    costForTwo : Number,
    type : String,
    coordinates : Array,
    Address : String,
    Ratings : Number,
    created_at : String,
    created_by : String,
    modified_at : String,
    modified_by : String,
    shape_id : Number,
},{collection : 'Zomato'})

module.exports = mongoose.model('Zomato',zomato_schema);