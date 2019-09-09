var demographyModel = require('../../models/shapefiles/demographyModel');
var shapeModel = require('../../models/shapefiles/shapes');
var turfService = require('../../services/turfService');

exports.getData = async (req, res) => {
    var geo = await Promise.all(req.body.dict.map(async (elem) => {
        var geometry = await shapeModel.getGeometry(elem);
        if(elem.level == 'Ward'){
            var demographyIntersects = await demographyModel.getGeointersectData(geometry);
            var allpoints = turfService.getPolygonsCoveringMoreThanFiftyPercent(geometry.coordinates, demographyIntersects);
            return allpoints;
        } else{
            var allpoints = await demographyModel.getGeowithinData(geometry);
            return allpoints
        }
    }))
    var properties = ['population', 'bengali', 'oriya', 'tamil', 'hindi', 'kannada', 'punjabi', 'telugu', 'malayalam', 'sindhi', 'marathi', 'gujarati', 
    'marwari', 'assamese', 'urdu', 'Female_35_50', 'Female_18_25', 'Female_50_70', 'Female_70_100', 'Female_25_35', 'Male_35_50', 'Male_18_25', 'Male_50_70',
     'Male_70_100', 'Male_25_35'];
    var max = {};
    properties.map((each) => {
        max[each] = 0
    });
    geo.forEach((point) => {
        point.forEach(async (elem) => {
            await Promise.all(properties.map(async (each) => {
                if(elem.properties[each] > max[each]){
                    max[each] = elem.properties[each];
                }
            }));
        })
    })
    var finalgeo = [];
    geo.forEach((point) => {
        point.forEach((elem) => {
            var dict = {
                type: "Feature",
                geometry: elem.geometry,
                properties:{
                    value:{},
                    index:{}
                }
            };
            properties.map((each) => {
                dict.properties.value[each] = elem.properties[each];
                dict.properties.index[each] = (elem.properties[each] / max[each]);
            })
            finalgeo.push(dict);
        })
    });
    res.send({
        "type":"FeatureCollection",
        "features": finalgeo
    })
}
