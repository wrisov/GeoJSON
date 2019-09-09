var propertyRatesModel = require('../../models/shapefiles/propertyRates');
var shapesModel = require('../../models/shapefiles/shapes');

exports.getRatesHeatMap = async (req, res) => {
    var allRates = await Promise.all(req.body.dict.map(async (eachArea) => {
        var geometry = await shapesModel.getGeometry(eachArea);
        var propertyRates = await propertyRatesModel.getPropertyRatesGeoWithin(geometry);
        return propertyRates;
    }));
    var sendHeatMap = [];
    allRates.forEach((element) => {
        var max = 0;
        element.forEach((elemb) => {
            if (elemb.properties.rate > max) {
                max = elemb.properties.rate;
            }
        });
        element.forEach((elemb) => {
            sendHeatMap.push([elemb.geometry.coordinates[1], elemb.geometry.coordinates[0], elemb.properties.rate / max]);
        });
    });
    res.send(sendHeatMap);
}