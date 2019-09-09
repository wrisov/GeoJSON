var pollingStationModel = require('../../models/shapefiles/pollingStations');

exports.getPopulationDensity = async (req, res) => {
    var layer = req.body.layer;
    var get = req.body.get;
    var finalResult = {};
    var circles = await Promise.all(req.body.coordinates.map(async (coordinate) => {
        var dict = {};
        dict.center = coordinate;
        dict.radius = parseFloat(req.body.radius);
        dict.filter = req.body.filter;
        return dict;
    }));
    var result = await Promise.all(circles.map(async (eachCircle) => {
        let area = (Math.PI * eachCircle.radius * eachCircle.radius)/1000000;
        let dataFromPollingStations = await pollingStationModel.getPointsInCircle(eachCircle.center, eachCircle.radius);
        let totalPopulation = 0;
        dataFromPollingStations.map((eachData) => {
            totalPopulation += eachData.totalVoters;
        })
        var finalResult = {
            area: area,
            population: totalPopulation,
            density: totalPopulation/area
        }
        return finalResult;
    }));
    res.send(result);
}
