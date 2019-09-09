const mongoose = require('mongoose');
const POI_schema = new mongoose.Schema({
    coordinates: Array,
    place_of_worship: Array,
    subway_station: Array,
    clothing_store: Array,
    restaurant: Array,
    gas_station: Array,
    type: String,
    accounting: Array,
    convenience_store: Array,
    food: Array,
    shape_id: Number,
    atm: Array,
    department_store: Array,
    bank: Array,
    shopping_mall: Array,
    pharmacy: Array,
    school: Array,
    hospital: Array,
    taxi_stand: Array
},{collection : 'POI'  });

POI_schema.statics.getPoiWithFiltersGeowithin = async function(geometry) {
    var pois = await this.find({geometry: {
        $geoIntersects: {
          $geometry: geometry
        }
      }}).then((data) => {
        return data;
      });
    return pois;
};

POI_schema.statics.getPoiKeys = async function() {
  var newKeys = await this.findOne().lean().exec((err, result) => {
    var keys = [];
      for (var key in result) {
        keys.push(key);
      }
    return keys;
    });
  return newKeys;
};

POI_schema.index({
    coordinates: '2dsphere'
});

POI_schema.statics.getPoiInCircle = async function(center, radius) {
  var data = await this.find({
    geometry: {
      $near: {
        $geometry: {
           type: "Point" ,
           coordinates: center
        },
        $maxDistance: radius
      }
    }
 }).then((result) => {
   console.log('result is', result);
  return result;
 });
 return data;
}

const ShapefilesDB = mongoose.connection.useDb('Shapefiles');

module.exports = ShapefilesDB.model('POI',POI_schema);