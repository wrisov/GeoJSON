const mongoose = require('mongoose');
const pathdisha_stop_schema = new mongoose.Schema({
    type : String,
    stopName : String,
    isJunction : String,
    modified_by : String,
    created_by : String,
    modified_at : String,
    stopId : String,
    created_at : String,
    coordinates : Array,
    routeCodes: Array
}, {collection: 'stops'});

pathdisha_stop_schema.statics.getStopsPointsInCircle = async function(center, radius, geometry){
    var stops;
    // if (filters.type === "A") {
    stops = await this.find({coordinates: {
        $near: {
            $geometry: {
                type: "Point",
                coordinates: center
                },
            $maxDistance: radius
        }
    }}).then((data) => {
        return data;
    });
    // } else if(filters.type === 'J') {
    //     stops = await this.find({coordinates: {
    //         $near: {
    //             $geometry:{
    //                 type: "Point",
    //                 coordinates: center
    //               },
    //             $maxDistance: radius
    //         }
    //     }, isJunction: "Y"}).then((data) => {
    //         return data;
    //     });
    // } else {
    //     stops = await this.find({coordinates: {
    //         $geoWithin: {
    //             $geometry:{
    //                 type: "Point",
    //                 coordinates: center
    //               },
    //             $maxDistance: radius
    //         }
    //     }, isJunction: "N"}).then((data) => {
    //         return data;
    //     });
    // }
    return stops;
}; 

pathdisha_stop_schema.statics.getStopsWithFiltersGeowithin = async function(filters, geometry) {
    var stops;
    if (!filters.type || filters.type === 'A') {
        stops = await this.find({coordinates: {
            $geoWithin: {
                $geometry: geometry
            }
        }}).then((data) => {
            return data;
        });
    } else if(filters.type === 'J') {
        stops = await this.find({coordinates: {
            $geoWithin: {
                $geometry: geometry
            }
        }, isJunction: "Y"}).then((data) => {
            return data;
        });
    } else {
        stops = await this.find({coordinates: {
            $geoWithin: {
                $geometry: geometry
            }
        }, isJunction: "N"}).then((data) => {
            return data;
        });
    }
    return stops;
};

// pathdisha_stop_schema.index({
//     coordinates: "2dsphere"
// });
const PathadishaDB = mongoose.connection.useDb('Pathadisha');
module.exports = PathadishaDB.model('stops', pathdisha_stop_schema);