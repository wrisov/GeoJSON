var zomatoModel = require('../../models/shapefiles/zomato');
var poiModel = require('../../models/shapefiles/POI');
var stopsModel = require('../../models/pathdisha/stopModel');
var hoponModel = require('../../models/pathdisha/hoponModel');
var routesModel = require('../../models/pathdisha/routesModel');
var pollingStationModel = require('../../models/shapefiles/pollingStations');
var propertyRatesModel = require('../../models/shapefiles/propertyRates');

exports.getDetails = (req, res) => {
    res.send([
        "Zomato costForTwo Average",
        "Zomato ratings Average",
        "Zomato votes Average"
    ]);
}

exports.getPoiInCircle = async (req, res) => {
    var result = await Promise.all(req.body.circles.map(async (eachCircles) => {
        var nosOfPoints = 0;
        var dict = {
            costForTwoMin: 1000000,
            costForTwoMax: 0,
            costForTwoAverage: 0,
            ratingsMin: 1000000,
            ratingsMax: 0,
            ratingsAverage: 0,
            votesMin: 1000000,
            votesMax: 0,
            votesAverage: 0
        }
        var response = await poiModel.getPoiInCircle(eachCircles.center, eachCircles.radius);
        response.forEach((resp) => {
            dict.costForTwoMin = resp.costForTwo ? resp.costForTwo < dict.costForTwoMin : dict.costForTwoMin;
            dict.costForTwoMax = resp.costForTwo ? resp.costForTwo > dict.costForTwoMax : dict.costForTwoMax;
            dict.costForTwoAverage = dict.costForTwoAverage + resp.costForTwo;
            dict.ratingsMin = resp.ratings ? resp.ratings < dict.ratingsMin : dict.ratingsMin;
            dict.ratingsMax = resp.ratings ? resp.ratings > dict.ratingsMax : dict.ratingsMax;
            dict.ratingsAverage = dict.ratingsAverage + resp.ratings;
            dict.votesMin = resp.votes ? resp.votes < dict.votesMin : dict.votesMin;
            dict.votesMax = resp.votes ? resp.votes > dict.votesMax : dict.votesMax;
            dict.votesAverage = dict.votesAverage + resp.votes;
            nosOfPoints++;
        });
        dict.costForTwoAverage = dict.costForTwoAverage / nosOfPoints;
        dict.votesAverage = dict.votesAverage / nosOfPoints;
        dict.ratingsAverage = dict.ratingsAverage / nosOfPoints;
        return dict;
    }));
    console.log(result);
    res.send(result);
};

exports.getDetailsInCircle = async (req, res) => {
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
    if(layer == "Zomato"){
        var result = await getZomatoInCircle(circles);
        await Promise.all(get.map(async (eachGet) => { 
            finalResult[eachGet] = await Promise.all(result.map(async (eachResult) => {
                return eachResult[eachGet];
            }));
        }));
        console.log(finalResult);
    }
    if(layer == "Transport"){
        var result = await Promise.all(circles.map(async (eachCircle) => {
            var temp = {};
            var stops = await stopsModel.getStopsPointsInCircle(eachCircle.center, eachCircle.radius, eachCircle.filter);
            var hopons = await hoponModel.getHoponPointsInCricle(stops, eachCircle.filter);
            var routes = await routesModel.getRoutesInCircle(stops);
            console.log(routes);
            // console.log(hopons[0][0].jumps);
            temp.stopsCount = stops.length;
            var totalhoponsCount = await Promise.all(hopons.map(async (hopon) => {
                var eachJumpCount = 0;
                hopon.map(async (eachHop) => {
                    eachJumpCount += eachHop.jumps;
                })
                return eachJumpCount;
            }));
            temp.hoponsCount = totalhoponsCount.reduce((a, b) => a + b, 0);
            temp.routesCount = routes;
            return temp;
        }));
        await Promise.all(get.map(async (eachGet) => {
            finalResult[eachGet] = await Promise.all(result.map(async (eachResult) => {
                return eachResult[eachGet];
            }));
        }));
    }
    if(layer == "POI"){
        var result = await Promise.all(get.map(async (eachGet) =>{
            let path = "../../models/POI/" + eachGet.split('C')[0]+"Model";
            let model = require(path);
            let count = await Promise.all(circles.map(async (eachCircle) => {
                let points = await model.getPointsInCircle(eachCircle.center, eachCircle.radius);
                return points.length;
            }));
            return count;
        }));
        var i = 0;
        await Promise.all(get.map(async (eachGet) => {
            finalResult[eachGet] = result[i];
            i++;
        }));
    }
    if(layer == "Demography"){
        var result = {
            populationCount: [],
            // propertyRatesAverage: [],
            pollingStationCount: [],
            // propertyCount: []
        };
        await Promise.all(circles.map(async (eachCircle) => {
            let area = (Math.PI * eachCircle.radius * eachCircle.radius)/1000000;
            let dataFromPollingStations = await pollingStationModel.getPointsInCircle(eachCircle.center, eachCircle.radius);
            // let dataFromPropertyRates = await propertyRatesModel.getPointsInCircle(eachCircle.center, eachCircle.radius);
            let totalPopulation = 0;
            let avgPropertyrate = 0;
            dataFromPollingStations.map((eachData) => {
                totalPopulation += eachData.totalVoters;
            })
            // dataFromPropertyRates.map((eachData) => {
            //     avgPropertyrate += eachData.properties.rate;
            // })
            // avgPropertyrate = avgPropertyrate / dataFromPropertyRates.length;
            result.populationCount.push(totalPopulation);
            // result.propertyRatesAverage.push(avgPropertyrate);
            // result.propertyCount.push(dataFromPropertyRates.length);
            result.pollingStationCount.push(dataFromPollingStations.length);
        }));
        await Promise.all(get.map(async (eachGet) => {
            finalResult[eachGet] = result[eachGet]
        }))
    }
    res.send(finalResult);
}

var getZomatoInCircle = async (circles) => {
    // console.log(req.body);
    var result = await Promise.all(circles.map(async (eachCircles) => {
        var nosOfPoints = 0;
        var dict = {
            costForTwoMin: 1000000,
            costForTwoMax: 0,
            costForTwoAverage: 0,
            ratingsMin: 1000000,
            ratingsMax: 0,
            ratingsAverage: 0,
            votesMin: 1000000,
            votesMax: 0,
            votesAverage: 0
        }
        var response = await zomatoModel.getZomatoPointsInCircle(eachCircles.center, eachCircles.radius, eachCircles.filter);
        response.forEach((resp) => {
            dict.costForTwoMin = resp.costForTwo < dict.costForTwoMin ? resp.costForTwo : dict.costForTwoMin;
            dict.costForTwoMax = resp.costForTwo > dict.costForTwoMax ? resp.costForTwo : dict.costForTwoMax;
            dict.costForTwoAverage = dict.costForTwoAverage + resp.costForTwo;
            dict.ratingsMin = resp.ratings < dict.ratingsMin ? resp.ratings : dict.ratingsMin;
            dict.ratingsMax = resp.ratings > dict.ratingsMax ? resp.ratings : dict.ratingsMax;
            dict.ratingsAverage = dict.ratingsAverage + resp.ratings;
            dict.votesMin = resp.votes < dict.votesMin ? resp.votes : dict.votesMin;
            dict.votesMax = resp.votes > dict.votesMax ? resp.votes : dict.votesMax;
            dict.votesAverage = dict.votesAverage + resp.votes;
            nosOfPoints++;
        });
        dict.costForTwoAverage = dict.costForTwoAverage / nosOfPoints;
        dict.votesAverage = dict.votesAverage / nosOfPoints;
        dict.ratingsAverage = dict.ratingsAverage / nosOfPoints;
        return dict;
    }));
    return result;
}