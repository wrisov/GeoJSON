var pollingStationsModel = require('../../models/shapefiles/pollingStations');
var shapesModel = require('../../models/shapefiles/shapes');

exports.getPollingStationsHeatMap = async (req, res) => {
    console.log('req', req.body);
    var allPollingStations = await Promise.all(req.body.dict.map(async (elem) => {
        var geometry = await shapesModel.getGeometry(elem);
        var pollingStationsWithinGeometry = await pollingStationsModel.getGeoWithinPolls(geometry);
        return pollingStationsWithinGeometry;
    }));
    var sendHeatMap = [];
    allPollingStations.forEach((element) => {
        var max = 0;
        element.forEach((elemb) => {
            if (elemb.totalVoters > max) {
                max = elemb.totalVoters;
            }
        });
        element.forEach((elemb) => {
            sendHeatMap.push([elemb.geometry.coordinates[1], elemb.geometry.coordinates[0], elemb.totalVoters / max]);
        });
    });
    res.send(sendHeatMap);
};