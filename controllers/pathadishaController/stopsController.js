
var stopsModel = require('../../models/pathdisha/stopModel');
var shapesModel = require('../../models/shapefiles/shapes');
var routesModel = require('../../models/pathdisha/routesModel');
var routeLinkModel = require('../../models/pathdisha/routeLinkModel');
var turf = require('@turf/turf');

exports.getStops = async (req, res) => {
    if (req.body.dict.length === 0) {
        res.send({
            "type": "FeatureCollection",
            "features": []
        });
    }
    else {
        let geometries = await Promise.all(req.body.dict.map(async (elem, index) => {
            let geometry = await shapesModel.getGeometry({name: elem.name, level: elem.level});
            return geometry;
        }));
        stopsArr = await Promise.all(geometries.map(async (eachChoordObj) => {
            var stops = stopsModel.getStopsWithFiltersGeowithin(req.body.filter, eachChoordObj);
            return stops;
        }));
        var geo = [];
        stopsArr.forEach((element) => {
            element.forEach((elem) => {
                geo.push({
                    "id": elem.stopId,
                    "type": elem.type,
                    "coordinates": elem.coordinates,
                    "isJunction": elem.isJunction,
                    "name": elem.stopName,
                });
            });
        });
        res.send(geo);
    }
};



//this ep is currently unused
exports.getRoutesFomStop = async (req, res) => {
    var maxDistance = 0;
    if (req.body.dict.stops.length === 0 && req.body.dict.length != null) {
        res.send({
            "type": "FeatureCollection",
            "features": []
          });
    } if (req.body.geowithin === 'N') {
        var features = Promise.all(req.body.dict.stops.map(async (ids) => {
            var routeCodeArr = await stopsModel.findOne({stopName: ids}).then((result) => {
                return result.routeCodes;
            });
            var routes = await Promise.all(routeCodeArr.map(async (elem) => {
                var findResult = await routesModel.find({routeCode: elem}).then(async (result) => {
                    var eachlinestring = await Promise.all(result.map(async (element) => {
                        var fromStopId = await stopsModel.find({stopId: element.fromStopId}).then((resulta) => {return resulta[0].coordinates;});
                        var toStopId = await stopsModel.find({stopId: element.toStopId}).then((resultb) => {return resultb[0].coordinates;});
                        var distance = await stopsModel.find({stopId: element.toStopId}).then((resultb) => {return resultb[0].distance;});
                        var returnJson = {};
                        returnJson.geometry = {};
                        returnJson.properties = {};
                        returnJson.properties.distance = distance;
                        returnJson.geometry.coordinates = [fromStopId, toStopId];
                        returnJson.geometry.type = 'lineString';
                        return returnJson;
                    }));
                    return eachlinestring;
                });
                return findResult;
            }));
            return routes;
        }));
        res.send({
            "type": "FeatureCollection",
            "features": features
          });
        // routesModel.findOne().exec((err, result) => {
        //     console.log('findone result', result);
        // });
    }
    if (req.body.geowithin === 'Y') {
        var features = Promise.all(req.body.dict.stops.map(async (ids) => {
            var routeCodeArr = await stopsModel.findOne({stopName: ids}).then((result) => {
                return result.routeCodes;
            });
            var routes = await Promise.all(routeCodeArr.map(async (elem) => {
                var findResult = await routesModel.find({routeCode: elem}).then(async (result) => {
                    var eachlinestring = await Promise.all(result.map(async (element) => {
                        var fromStopId = await stopsModel.find({stopId: element.fromStopId}).then((resulta) => {return resulta[0].coordinates});
                        var toStopId = await stopsModel.find({stopId: element.toStopId}).then((resultb) => {return resultb[0].coordinates});
                        var distance = await stopsModel.find({stopId: element.toStopId}).then((resultb) => {return resultb[0].distance});
                        // console.log('from', fromStopId, 'to', toStopId);
                        var returnJson = {};
                        returnJson.geometry = {};
                        returnJson.properties = {};
                        returnJson.properties.distance = distance;
                        if (distance > maxDistance){maxDistance = distance;}
                        returnJson.geometry.coordinates = [fromStopId, toStopId];
                        returnJson.geometry.type = 'lineString';
                        return returnJson;
                    }));
                    return eachlinestring;
                });
                return findResult;
            }));
            var geometry = await Promise.all(req.body.dict.area.map((element) => {
                shapesModel.findOne({name: element.name, level: element.area.level}).then((data) => {
                    var returnGeometry = {};
                    returnGeometry.coordinates = data.coordinates;
                    returnGeometry.type = data.type;
                });
            }));
            var geowithinRoutes = await Promise.all(routes.map((element) => {
                element.find({coordinates: {
                    $geoWithin:{
                        $geometry: geometry
                    }
                }});
            }));
            return geowithinRoutes;
        }));
        res.send({
            "type": "FeatureCollection",
            "features": features
          });
    }
};
//the above ep is currently unused

exports.getRouteObjects = (req, res) => {
    stopsModel.find().exec(async (err, result) => {
        var tempObjArr = await Promise.all(result.map((elem) => {
            var returnObj = {};
            returnObj.stopName = elem.stopName;
            returnObj.routeCodes = elem.routeCodes;
            returnObj.routeCodes.push('All');
            return returnObj;
        }));
        res.send(tempObjArr);
        return false;
    });
};

exports.getRoutesFromStop = async (req, res) => {
    var flag = 0;
    var colorArr = ['#EC7063 ','#8E44AD','#8E44AD','#1ABC9C','#F1C40F','#E67E22','#CACFD2'];
    var routeColorMap = {};
    var colorCounter = 0;
    var maxDistance = 0;
    var finalResp = await Promise.all(req.body.dict.map(async (eachobj) => {

       if (eachobj.routeCode != 'All')
       { var routeObj = await routesModel.find({routeCode: eachobj.routeCode}).then(async (data) => {
            var geometries = await Promise.all(data.map(async (elem) => {
                var fromStopCoord = await stopsModel.find({stopId: elem.fromStopId}).then((result) => {return result[0].coordinates;});
                var toStopCoord = await stopsModel.find({stopId: elem.toStopId}).then((result) => {return result[0].coordinates;});
                var distance = elem.distance;
                var returnArr = [];
                var returnJson = {};
                returnJson.filter = 'solo';
                // for (var keys in routeColorMap) {
                //     if (keys === elem.routeCode) {
                //         flag = 0;
                //     }
                // }
                // if (flag === 1) {
                //     routeColorMap[elem.routeCode] = colorArr[colorCounter];
                //     colorCounter++;
                //     colorCounter % colorArr.length;
                //     flag = 0;
                // }
                if (!routeColorMap[elem.routeCode]) {
                    routeColorMap[elem.routeCode] = colorArr[colorCounter];
                    colorCounter++;
                }
                returnJson.distance = distance;
                returnJson.routeCode = elem.routeCode;
                if (distance > maxDistance){maxDistance = distance;}
                returnJson.geometry = {};
                returnJson.geometry.coordinates = [fromStopCoord, toStopCoord];
                returnJson.geometry.type = 'LineString';
                returnArr[0] = await returnJson;
                return returnArr;
            }));
            return geometries;
        });
        return routeObj;
        }
        if (eachobj.routeCode === 'All') {
                var routeCodeArr = await stopsModel.findOne({stopName: eachobj.stop}).then((result) => {
                    return result.routeCodes;
                });
                console.log(routeCodeArr);
                var routes = await Promise.all(routeCodeArr.map(async (elem) => {
                    var findResult = await routesModel.find({routeCode: elem}).then(async (result) => {
                        var eachlinestring = await Promise.all(result.map(async (element) => {
                            var fromStopId = await stopsModel.find({stopId: element.fromStopId}).then((resulta) => {return resulta[0].coordinates;});
                            var toStopId = await stopsModel.find({stopId: element.toStopId}).then((resultb) => {return resultb[0].coordinates;});
                            var distance = element.distance;
                            var returnJson = {};
                            // for (var keys in routeColorMap) {
                            //     if (keys === elem.routeCode) {
                            //         flag = 0;
                            //     }
                            // }
                            // if (flag === 1) {
                            //     routeColorMap[elem.routeCode] = colorArr[colorCounter];
                            //     colorCounter++;
                            //     colorCounter % colorArr.length;
                            //     flag = 0;
                            // }
                            if (!routeColorMap[elem.routeCode]) {
                                routeColorMap[elem.routeCode] = colorArr[colorCounter];
                                colorCounter++;
                            }
                            returnJson.distance = distance;
                            returnJson.filter = 'All';
                            returnJson.routeCode = element.routeCode;
                            if (distance > maxDistance){maxDistance = distance;}
                            returnJson.geometry = {};
                            returnJson.geometry.coordinates = [fromStopId, toStopId];
                            returnJson.geometry.type = 'LineString';
                            return returnJson;
                        }));
                        return eachlinestring;
                    });
                    return findResult;
                }));
                return routes;
        }
    }));
    var shapesCoordArr = await Promise.all(req.body.area.map((element) => {
        tempCoord = shapesModel.findOne({name: element.name, level: element.level}).then((data) => {
            return turf.polygon(data.coordinates);
        });
        return tempCoord;
    }));
    var featurecollection = turf.featureCollection(shapesCoordArr);
    var fc = turf.combine(featurecollection);
    console.log('fc', fc.features[0]);
    var finalGeowithinResp = await Promise.all(finalResp.map(async (element) => {
        tempArrA = await Promise.all(element.map(async (Objs) => {
            tempArrB = await Promise.all(Objs.map((elem) => {
                var point = turf.point(elem.geometry.coordinates[0]);
                if (turf.booleanPointInPolygon(point, fc.features[0])) {
                    return elem;
                }
            }));
            // console.log(tempArrB);
            return tempArrB;
        }));
        return tempArrA;
    }));
    var geo = [];
      finalGeowithinResp.forEach((element, indexa) => {
          if(element === null)
          {
          return featureCollection; 
          }
          element.forEach((Objs, indexb) => {
              Objs.forEach((elem) => {
                  if (elem) {
                    geo.push({
                        "type": "Feature",
                        "distance": elem.distance,
                        "geometry": elem.geometry,
                        "properties": {
                            "distance": elem.distance,
                            "routeCode": elem.routeCode,
                            "color": routeColorMap[elem.routeCode] 
                        }
                    });
                  }
              });
          });
      });
      res.send({"geoJSON": {
        "type": "FeatureCollection",
        "features": geo
    }});
};

exports.getRoutesFromDatabase = async (req, res) => {

    if (!req.body.dict.length) {
        res.send(
            {
                "type": "FeatureCollection",
                "features": []
            }
        );
    } else {
        var colorArr = ['#EC7063 ','#8E44AD','#8E44AD','#1ABC9C','#F1C40F','#E67E22','#CACFD2'];
        var lineStringFinalArr = await Promise.all(req.body.dict.map(async (elem, index) => {
            var geometry = await shapesModel.getGeometry({name: elem.name, level: elem.level});
            var poly = turf.polygon(geometry.coordinates);
        var perFilterLineString = await Promise.all(req.body.filter.map(async (eachFilter) => {
                if (eachFilter.routeCode === 'All') {
                    var allLineStringsMore = await stopsModel.findOne({stopName: eachFilter.stop}).then(async (data) => {
                        var allLineStrings = await Promise.all(data.routeCodes.map(async (eachRoute) => {
                            var lineString = await routeLinkModel.findOne({routeCode: eachRoute}).then(async (eachRoute) => {
                                if (eachRoute) {
                                    // console.log('each stop', eachRoute.stopCoord);
                                    if (eachRoute.stopCoord.length > 1) {
                                        var coords = await eachRoute.stopCoord.filter((elem) => {
                                            if (turf.booleanPointInPolygon(turf.point(elem), poly)){
                                                return elem;
                                            }
                                        });
                                        return {name: eachRoute.routeCode, coords: coords};
                                    }
                                }
                            });
                            return lineString;
                        }));
                        return allLineStrings;
                    });
                    return {type: 'all', coords: allLineStringsMore};
                } else {
                    var routes = await routeLinkModel.getStopsFromRoute(eachFilter.routeCode);
                    var lineString = await Promise.all(routes.DN.map(async (elem) => {
                        var coords = await stopsModel.findOne({stopId: elem}).then((data) => {
                            var pt = turf.point(data.coordinates);
                            if(turf.booleanPointInPolygon(pt, poly));
                            {
                                return data.coordinates;
                            }
                        });
                        return coords;
                    }));

                    return {type: 'notAll',name: eachFilter.routeCode,coords: lineString};
                }
            }));
            return perFilterLineString;
        }));
        var geo = [];
        lineStringFinalArr.forEach((elemc) => {
            elemc.forEach((elema, indexa) => {
                if (elema.type === 'all') {
                    elema.coords.forEach((elemb, index) => {
                        console.log(elemb);
                        if (elemb) {
                            console.log(elemb);
                            if (elemb.coords.length > 1) {geo.push(turf.lineString(elemb.coords, {name: elemb.name, color: colorArr[index % colorArr.length]}));}
                        }
                    });
                }else {
                    if (elema.coords.length > 1) {
                        console.log(elema);
                        geo.push(turf.lineString(elema.coords, {name: elema.name, color: colorArr[indexa % colorArr.length]}));
                    }
                }
            });
        });
        res.send({
            "type": "FeatureCollection",
            "features": geo
        });
    }
};

// this endpoint need to be updated according to hoppon data

exports.getHeatMap = async (req, res) => {
    if (req.body.dict.length === 0)
    {
        res.send({
            "type": "FeatureCollection",
            "features": []
        });
    }
    else {
        var geo = [];
        req.body.filter = req.body.filter ? req.body.filter : {};
        hour.min = Number(req.body.filter.hour ? req.body.filter.hour.min : 0);
        hour.max = Number(req.body.filter.hour ? req.body.filter.hour.max : 10000000);

        let coordinates = await Promise.all(req.body.dict.map(async (elem, index) => {
            let coord = await shapesModel.find({
                "name": elem.name,
                "level": elem.level
            }).then((data) => {
                return {"coordinates": data[0].coordinates, "type": data[0].type};
            });
            return coord;
        }));
        stopsArr = await Promise.all(coordinates.map(async (eachChoordObj) => {
            var stops;
            stops = await stopsModel.find({coordinates: {
                $geoWithin: {
                    $geometry: {
                        coordinates: eachChoordObj.coordinates,
                        type: eachChoordObj.type
                    }
                }
            }})
            .then((data) => {
                return data;
            });
            return stops;
        }));
        stopsArr.forEach((element) => {
            // element.forEach((elem) => {
            //     var randInt = Math.random();
            //     elem.coordinates.push(randInt);
            //     var returnElem = [elem.coordinates[1], elem.coordinates[0], elem.coordinates[2]];
            //     geo.push(returnElem);
            // });
        });
        res.send(geo);
        // finalResp.forEach((element) => {
        //     element[0].forEach((elem) => {
        //         console.log('elem', elem);
        //         // var randInt = 60 + (Math.floor(40 * Math.random()));
        //         var randInt = Math.random();
        //         elem.push(randInt);
        //         var returnElem = [elem[1], elem[0], elem[2]];
        //         geo.push(returnElem);
        //     });
        // });
        // res.send(geo);
    }
};


    //  [
    //   [
    //     22.642036, 88.431522, 100
    //   ],
    //   [
    //     22.643036, 88.431522, 65
    //   ] // lat, lng, intensity

    // ]
