var satelliteModel = require('../../models/shapefiles/satelliteModel');
var shapesModel = require('../../models/shapefiles/shapes');
var turfService = require('../../services/turfService');

exports.getData = async (req, res) => {
    var geo = [];
    var data = await Promise.all(req.body.dict.map(async (elem) => {
        var geometry = await shapesModel.getGeometry(elem);
        if (elem.level !== 'Ward') {
            var geoWithinSatellites = await satelliteModel.getGeoWithinSatellitesWithFilters(geometry);
            // geo.push(...geoWithinSatellites);
            geoWithinSatellites.forEach((elem) => {
                console.log('elem', elem);
                geo.push({
                    type: "Feature",
                    geometry: elem.geometry,
                    properties: elem.properties
                })
            });
        } else {
            var geoWithinSatellites = await satelliteModel.getGeoIntersectSattelitesData(geometry);
            geoWithinSatellites.forEach((element) => {
                console.log('each element', element);
            });
        // return geoWithinSatellites;
            var polEach = turfService.getPolygonsCoveringMoreThanFiftyPercent(geometry.coordinates, geoWithinSatellites);
            geo.push(...polEach);
            let count = 0;
            polEach.forEach(() => {
                count++;
            });
            console.log('count is', count);
        }
    }));
    res.send({
        "type": "FeatureCollection",
        "features": geo
      });
};