var express = require('express');
var POIModel = require('../../models/shapefiles/POI');
var mongoose = require('mongoose');
var shapes = require('../../models/shapefiles/shapes');
var geoJsonParser = require('../../services/geoJsonParser');
var ZomatoModel = require('../../models/shapefiles/zomato');
var turf = require('@turf/turf');
exports.findPOI = (req, res) => {
  POIModel.findOne({}, (err, value) => {
    res.send(value);
  });
};

exports.getCumilativePoiData = async function(req, res){
  var finalResult = {}
  await Promise.all(req.body.dict.map(async (eachArea) => {
    var geometry = await shapes.getGeometry(eachArea);
    var dict = {}
    await Promise.all(req.body.get.map(async (eachGet) => {
      var model = require('../../models/POI/' + eachGet + 'Model');
      var data  = await model.getGeowithin(geometry);
      dict[eachGet] =  data.length;
    }));
    finalResult[eachArea.name] = dict;
  }));
  res.send(finalResult);
};

exports.getpoi = async function (req, res) {
  let filters = req.body.filter ? req.body.filter : [];
  if (req.body.dict.length === 0) {
    res.send({
      "type": "FeatureCollection",
      "features": []
    });
  } else {
    var coordinates1, coordinates2;
    let FilterSumsArray = [];
    let filtermax = 0;
    var POIelements = await Promise.all(req.body.dict.map(async (elem) => {
        let coords = await shapes.getCoordinates({name: elem.name, level: elem.level});
        let geometry = await shapes.getGeometry({name: elem.name, level: elem.level});
        let parentPolygon = turf.polygon(coords);
        let pois = await POIModel.getPoiWithFiltersGeowithin(geometry);
        pois.forEach((elem, index) => {
          let sum = 0;
          elem.counts = {};
          filters.forEach((filter) => {
            sum += elem[filter].length;
            elem.counts[filter] = elem[filter].length;
          });
          elem.sum = sum;
          if (sum > filtermax) {
            filtermax = sum;
          }
          let polyPoi = turf.polygon(elem.coordinates);
          let area = turf.area(polyPoi);
          let difference = turf.difference(polyPoi, parentPolygon);
          if (difference) {
            let diffarea = turf.area(difference);
            let percentage = (diffarea) / area * 100;
            if (percentage > 50) {
              pois[index] = null;
            }
          } else {
          }
          // let diffarea = turf.area(difference);
          // console.log('difference', difference);
          // let percentage = diffarea/area*100;
          // console.log('percent out', percentage);
        });
        return pois;
    }));
    var geo = [];
    POIelements.forEach((element, indexa) => {
      if (element === null) {
        return featureCollection;
      }
      element.forEach((elem, indexb) => {
        if (elem) {
          let color = req.body.filter ? [elem.sum / filtermax * 255, 0, (1 - (elem.sum / filtermax)) * 255] : [255, 0, 0];
          geo.push({
            "type": "Feature",
            "id": elem.shape_id,
            "geometry": {
              "type": elem.type,
              "coordinates": elem.coordinates,
            },
            "properties": {
              "name": elem.name,
              "level": elem.level,
              "counts": elem.counts,
              "id": elem.shape_id,
              "color": color
            }
          });
        }
      });
    });
    res.send({
      "type": "FeatureCollection",
      "features": geo
    });
  }
};


exports.getPoiRandProperty = async function (req, res) {
  let filters = req.body.filter ? req.body.filter : [];
  if (req.body.dict.length === 0) {
    res.send({
      "type": "FeatureCollection",
      "features": []
    });
  } else {
    var coordinates1, coordinates2;
    let FilterSumsArray = [];
    let filtermax = 0;
    var POIelements = await Promise.all(req.body.dict.map(async (elem) => {
      if (elem.name && elem.level) {
        let coords = await shapes.find({
          name: elem.name,
          level: elem.level
        }).then((data) => {
          return data[0].coordinates;
        });
        let parentPolygon = turf.polygon(coords);
        let pois = await POIModel.find({
          geometry: {
            $geoIntersects: {
              $geometry: {
                type: "Polygon",
                coordinates: coords
              }
            }
          }
        }).then(async (data) => {
          let filterSums = await Promise.all(data.map((element) => {
            let sum = 0;
            filters.forEach((filter) => {
              sum += element[filter];
            });
            element.sum = sum;
            if (sum > filtermax) {
              filtermax = sum;
            }
          }));
          return data;
        });
        pois.forEach((elem, index) => {
          let polyPoi = turf.polygon(elem.coordinates);
          let area = turf.area(polyPoi);
          let difference = turf.difference(polyPoi, parentPolygon);
          if (difference) {
            let diffarea = turf.area(difference);
            let percentage = (diffarea) / area * 100;
            if (percentage > 50) {
              pois[index] = null;
            }
          } else {
          }
          // let diffarea = turf.area(difference);
          // console.log('difference', difference);
          // let percentage = diffarea/area*100;
          // console.log('percent out', percentage);
        });
        return pois;
      }
    }));
    var geo = [];
    POIelements.forEach((element, indexa) => {
      if (element === null) {
        return featureCollection;
      }
      element.forEach((elem, indexb) => {
        if (elem) {
          let color = req.body.filter ? [elem.sum / filtermax * 255, 0, (1 - (elem.sum / filtermax)) * 255] : [255, 0, 0];
          geo.push({
            "type": "Feature",
            "id": elem.shape_id,
            "geometry": {
              "type": elem.type,
              'atms': elem.atm,
              "coordinates": elem.coordinates,
            },
            "properties": {
              "profitability": Math.floor(Math.random() * 100),
              "affluence": Math.floor(Math.random() * 60)
            }
          });
        }
      });
    });
    res.send({
      "type": "FeatureCollection",
      "features": geo
    });
  }
}
// filters needed to be added
exports.getPoiInRadius = (req, res) => {
  if (!req.body.filter) {
    var input = req.body.dict;
    input.map(element => {
      var radius = element.radius;
      var lng = element.lng;
      var lat = element.lat;
      var pos = [parseFloat(lng), parseFloat(lat)];
      POIModel.find({
        geometry: {
          $near: {
            $geometry: {
              type: "Polygon",
              coordinates: pos
            },
            $maxDistance: radius
          }
        }
      }).then(function (result, err) {
        if (err) {
          next(err);
        } else {
          res.send(geoJsonParser(result));
        }
      });
    });
  } else {}
};

exports.getPoiFilters = async (req, res) => {
  // var keys = [];
  // var schematodo = await POIModel.findOne().then((response) => {return response});
  // for (var key in schematodo) {
  //   if (key.slice(0, 1) === '$' || key.slice(0, 1) === '_' || key === 'db' || key === 'discriminators') {
  //     continue;
  //   }
  //   keys.push(key);
  // }
  // res.send(keys);
  await POIModel.findOne().lean().exec((err, result) => {
    var keys = [];
      for (var key in result) {
        keys.push(key);
      }
    res.send(keys)
    });
};


exports.getAllPoi = (req, res) => {

  POIModel.find().exec((err, result) => {
    res.send(geoJsonParser(result));
  });
}

exports.getPoiById = async (req, res) => {
  var filterArray = await POIModel.findOne().lean().then((err, result) => {
    for (key in result) {
      if (result[key]) {
        return key;
      }
    }
  });
  var numberArray = await POIModel.findOne().exec(async (err, result) => {
    var tempFilters = await Promise.all(filterArray.map((elem) => {
      if (typeof (result[elem]) === 'number' && elem) {
        return elem;
      }
    }));
    return tempFilters;
  });
};

exports.getIntersects = (req, res) => {
  let counter = 0;
  POIModel.find({}, async (err, result) => {
    let coords = await Promise.all(result.map((elem) => {
      counter++;
      return elem.coordinates;
    }));
    let poly1 = turf.polygon(coords[0]);
    let poly2 = turf.polygon(coords[1]);
    coordtemp = turf.intersect(poly1, poly2).geometry.coordinates;
    turf.intersect(poly2, poly1).geometry.coordinates.forEach((elem) => {
      coordtemp.push(elem);
    });
    let intersectPoly = turf.polygon(coordtemp);
    turf.area();
  });
};