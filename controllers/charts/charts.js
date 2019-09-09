var zomatoModel = require('../../models/shapefiles/zomato');
var shapesModel = require('../../models/shapefiles/shapes');
var POIModel = require('../../models/shapefiles/POI');

exports.getZomatoCharts = async (req, res) => {
    if (!req.body.dict) {
        res.send({
            type: "FeatureCollection",
            features: "[]"
        });
    } else {
        var counter = 0;
        var ratingsCounterLookUp = {
            '1-2': 0,
            '2-3': 0,
            '3-4': 0,
            '4-5': 0,
        };
        var lookupCuisinesCount = {};
        req.body.dict.forEach(async (element) => {
            var geometry = await shapesModel.getGeometry({name: element.name, level: element.level});
            zomatoPoints = await zomatoModel.getGeowithin(geometry);
            zomatoPoints.forEach((elem) => {
                elem.cuisines.forEach((eachCuisine) => {
                    if (lookupCuisinesCount[eachCuisine]) {
                        lookupCuisinesCount[eachCuisine]++;
                    } else {
                        lookupCuisinesCount[eachCuisine] = 1;
                    }
                });
            });
            for (var i = 1; i < 5; i++) {
                var testData = await zomatoModel.findByFilter(
                    {
                        ratings: {
                            min: i,
                            max: i + 1,
                        }
                    }, geometry);
                ratingsCounterLookUp[i + '-' + Number(i+1)] += testData.length;
            }
            counter++;
        });
        var interval = setInterval(() => {
            if (counter === req.body.dict.length && ratingsCounterLookUp['5-6'] !== null) {
                clearInterval(interval);
                var sortedObj = Object.keys(lookupCuisinesCount).sort((a, b) => {
                    return lookupCuisinesCount[b] - lookupCuisinesCount[a];
                });
                var obj = sortedObj.map((elem) => {
                    return{[elem]: lookupCuisinesCount[elem]};
                });
                res.send({cuisines: obj, ratings: ratingsCounterLookUp});
            }
        }, 100);
    }
};

exports.getZomatoComparisionCharts = async (req, res) => {
    if(!req.body.dict){
        res.send({
            type: "FeatureCollection",
            features: []
        })
    }
    else{
        var counter = 0;
        var cuisineList = [];
        req.body.dict.forEach(async (element) => {
            var geometry = await shapesModel.getGeometry({name: element.name, level: element.level});
            var zomatoPoints = await zomatoModel.getGeowithin(geometry);
            var lookupCuisinesCount = {}
            zomatoPoints.forEach((elem) => {
                elem.cuisines.forEach((cuisine) => {
                    if(lookupCuisinesCount[cuisine]){
                        lookupCuisinesCount[cuisine]++;
                    } else{
                        lookupCuisinesCount[cuisine] = 1;
                    }
                });
            });
            cuisineList.push({name: element.name, cuisines: lookupCuisinesCount});
            counter++;
        });
        
        var interval = setInterval(() => {
            if(counter === req.body.dict.length){
                clearInterval(interval);
                var finalCuisineList = [];
                cuisineList.forEach(async (eachLocationCuisines) => {
                    var Sortedlist = Object.keys(eachLocationCuisines.cuisines).sort((a,b) => {
                        return eachLocationCuisines.cuisines[b] - eachLocationCuisines.cuisines[a];
                    });
                    Sortedlist = Sortedlist.slice(0, 5);
                    var obj = Sortedlist.map((elem) => {
                        return {[elem] : eachLocationCuisines.cuisines[elem]};
                    });
                    obj.name = eachLocationCuisines.name;
                    finalCuisineList.push({name: eachLocationCuisines.name, cuisines: obj});
                });    
                res.send(finalCuisineList);
            }
        }, 100);
    }
};

exports.getPoiCharts = async (req, res) => {
        POIelements = {};
        let filters = req.body.filter ? req.body.filter : [];
        if (req.body.dict.length === 0) {
          res.send({
          });
        } else {
          var poiresp = await Promise.all(req.body.dict.map(async (elem) => {
                var lookUpPOI = {
                    id: 0,
                    place_of_worship: 0,
                    subway_station: 0,
                    clothing_store: 0,
                    restaurant: 0,
                    gas_station: 0,
                    convenience_store: 0,
                    food: 0,
                    department_store: 0,
                    atm: 0,
                    bank: 0,
                    shopping_mall: 0,
                    pharmacy: 0,
                    school: 0,
                    hospital: 0,
                    taxi_stand: 0
                };
                let geometry = await shapesModel.getGeometry({name: elem.name, level: elem.level});
                let pois = await POIModel.getPoiWithFiltersGeowithin(geometry);
                pois.forEach((elem, index) => {
                    Object.keys(lookUpPOI).forEach((filter) => {
                        lookUpPOI[filter] += elem[filter].length;
                    });
                    // let diffarea = turf.area(difference);
                    // console.log('difference', difference);
                    // let percentage = diffarea/area*100;
                    // console.log('percent out', percentage);
                });
                POIelements[elem.name] = lookUpPOI;
                return 0;
          }));
          res.send(POIelements);
        }
};