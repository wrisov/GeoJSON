/*jshint esversion: 6 */
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const zomato_schema = new Schema({
    votes: Number,
    locality: String,
    cuisines: Array,
    'Most Popular': Array,
    name: String,
    costForTwo: Number,
    type: String,
    coordinates: Array,
    Address: String,
    ratings: Number,
    created_at: String,
    created_by: String,
    modified_at: String,
    modified_by: String,
    shape_id: Number,
}, {
    collection: 'Zomato'
});

zomato_schema.statics.getGeowithin = async function(geometry) {
    var zomatoPoints = this.find({
        coordinates: {
            $geoWithin: {
                $geometry: geometry
            }
        }
    }).then((data) => {
        return data;
    });
    return zomatoPoints;
};

zomato_schema.statics.getZomatoPointsInCircle = async function(center, radius,filter) {
    var filter = filter ? filter : {};
    var votes = {};
    var costfortwo = {};
    var ratings = {};
    votes.min = Number(filter.votes ? filter.votes.min : 0);
    votes.max = Number(filter.votes ? filter.votes.max : 10000000);
    costfortwo.min = Number(filter.costfortwo ? filter.costfortwo.min : 0);
    costfortwo.max = Number(filter.costfortwo ? filter.costfortwo.max : 10000000);
    ratings.min = Number(filter.ratings ? filter.ratings.min : 0);
    ratings.max = Number(filter.ratings ? filter.ratings.max : 10);
    var zomatoPoints = await this.find({coordinates: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: center
          },
          $maxDistance: radius
        }
      }}).gte('ratings', ratings.min).lte('ratings', ratings.max)
      .gte('votes', votes.min).lte('votes', votes.max)
      .gte('costForTwo', costfortwo.min).lte('costForTwo', costfortwo.max).then((data) => {
        return data;
      });
      return zomatoPoints;
}

zomato_schema.statics.findByFilter = async function(filter, geometry) {
    filter = filter ? filter : {};
    var cuisine = filter.cuisines ? filter.cuisines : null;
    var votes = {},
    costfortwo = {},
    ratings = {};
    votes.min = Number(filter.votes ? filter.votes.min : 0);
    votes.max = Number(filter.votes ? filter.votes.max : 10000000);
    costfortwo.min = Number(filter.costfortwo ? filter.costfortwo.min : 0);
    costfortwo.max = Number(filter.costfortwo ? filter.costfortwo.max : 10000000);
    ratings.min = Number(filter.ratings ? filter.ratings.min : 0);
    ratings.max = Number(filter.ratings ? filter.ratings.max : 10);
    var zomatoPoints = await this.find({
        coordinates: {
            $geoWithin: {
                $geometry: geometry
            }
        }
    }).gte('ratings', ratings.min).lte('ratings', ratings.max)
    .gte('votes', votes.min).lte('votes', votes.max)
    .gte('costForTwo', costfortwo.min).lte('costForTwo', costfortwo.max).then((result) => {
        if (cuisine) {
            result.forEach((elemResult) => {
                elemResult.cuisines.forEach((elem) => {
                    if (elem === cuisine) {
                        return elemResult;
                    }
                });
            });
        } else {
            return result;
        }
    });
    return zomatoPoints;
};

zomato_schema.index({
    coordinates: "2dsphere"
});
const ShapefilesDB = mongoose.connection.useDb('Shapefiles');
module.exports = ShapefilesDB.model('zomato', zomato_schema);