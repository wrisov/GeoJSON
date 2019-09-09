var hoponModel = require('../../models/pathdisha/hoponModel');
var shapesModel = require('../../models/shapefiles/shapes');
var stopsModel = require('../../models/pathdisha/stopModel');


exports.getHoponHeatMap = async (req, res) => {
    if (!req.body.dict) {
        res.send({
            "type": "FeatureCollection",
            "features": []
        });
    } else {
        var maxHoponCount = 0;
        process.env.TZ = 'Asia/India';
        dateTimeFromString = 'July 25, 2019 ' + req.body.filter.fromTime +':00:00:000';
        dateTimeToString = 'July 25, 2019 ' + req.body.filter.toTime +':00:00:000';
        var fromTime = new Date(dateTimeFromString);
        var toTime = new Date(dateTimeToString);
        var counter = 0;
        var hoponAreaArr = await Promise.all(req.body.dict.map(async (element) => {
            var geometry = await shapesModel.getGeometry({name: element.name, level: element.level});
            geoWithinStops = await stopsModel.find({
                coordinates: {
                    $geoWithin: {
                        $geometry: geometry
                    }
                }
            }).then((data) => {
                return data;
            });
            var hoponPerArea = await Promise.all(geoWithinStops.map(async (element) => {
                hopondata = await hoponModel.find({'stop.stopId': element.stopId}).gte('fromTime', fromTime).lte('toTime', toTime).then(async (data) => {
                    var counter = 0;
                    var hoponCountAdd = 0;
                    totalHoponArr = await data.map((hoponPerStop) => {
                        hoponCountAdd += hoponPerStop.stop.count;
                        counter++;
                        
                        return 1;
                    });
                    if (maxHoponCount < hoponCountAdd) {maxHoponCount = hoponCountAdd;}
                    return {'hoponHeats': [element.coordinates[1], element.coordinates[0], hoponCountAdd], 'count': counter};
                });
                return hopondata;
            }));
            return hoponPerArea;
        }));
        var geo = [];
        hoponAreaArr.forEach((elementa, indexa) => {
            elementa.forEach((elementb, indexb) => {
                geo.push([elementb.hoponHeats[0], elementb.hoponHeats[1], elementb.hoponHeats[2] / (maxHoponCount)]);
                    // elementc.forEach((elementd, indexd) => {
                    //     console.log('each heat array', elementd);
                    // });
            });
        });
        res.send(geo);
    }
};