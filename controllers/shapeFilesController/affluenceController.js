var affluenceModel = require('../../models/shapefiles/affluenceModel');
var shapeModel = require('../../models/shapefiles/shapes');
var turfService = require('../../services/turfService');

exports.getData = async (req, res) => {
    var geo = await Promise.all(req.body.dict.map(async (elem) => {
        var geometry = await shapeModel.getGeometry(elem);
        if(elem.level == 'Ward'){
            var affluenceIntersects = await affluenceModel.getGeointersectData(geometry);
            var allpoints = turfService.getPolygonsCoveringMoreThanFiftyPercent(geometry.coordinates, affluenceIntersects);
            return allpoints;
        } else{
            var allpoints = await affluenceModel.getGeowithinData(geometry);
            return allpoints;
        }
    }))
    var finalgeo = [];
    geo.forEach((elem) => {
        elem.forEach((square) => {
            var dict = {};
            dict["type"] = "Feature";
            dict["geometry"] = square.geometry;
            dict["properties"] = square.properties;
            finalgeo.push(dict);
        })
    })
    res.send({
        "type":"FeatureCollection",
        "features": finalgeo
        })
}
