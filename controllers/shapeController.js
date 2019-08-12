const express = require('express');
const app = express();
var geoJsonParser = require('../services/geoJsonParser');
const shapes = require('../models/shapes.js');
const zomato = require('../models/zomato.js');
const POI = require('../models/POI.js');


exports.loadname = function(req,res){
    shapes.find({},(err,result)=> {
     res.status(200).send(result.name);
    });
  };

exports.loadlevel = function(req,res){
  shapes.find().distinct('level' , (err, result) => {
    res.status(200).send(result);
  });
};

exports.getlevelnames = (req, res) => {
  var data = [];
  var upperLevel;
  console.log('body is', req.body.level);
  var level = req.body.level;
  if (level === 'District' || level === 'Assembly Constituency' || level === 'Parliamentary Constituency' || level === 'City') {
    upperLevel = 'State';
  }
  if (level === 'Town' || level === 'Village') {
    upperLevel = 'District';
  }
  if (level === 'Ward') {
    upperLevel = 'City';
  }
  console.log('level is', level);
  console.log('upperlevel is', upperLevel);
  shapes.find({'level': level}, (err, result) => {
    console.log('result is', result);
    data = result.map((element, index) => {
      return {name: element.name, level: element.level};
    });
    console.log('data', data);
    console.log('level is', level);
    if (level === 'State') {
      res.send(data);
    }
  });
  if (level !== 'State') {
    shapes.find({'level': upperLevel}, (err, result) => {
      console.log('result 2 is', result)
      result.forEach((element, index) => {
        data.push({name: element.name, level: element.level});
      });
      console.log('datais', data);
      res.send(data);
    });
  }
}

  exports.loadnew = function(req,res){
    console.log('body is', req.body);
    var name = req.body.name;
    var level = req.body.level;
    var currentLevel = req.body.currentLevel;
    if (level === currentLevel) {
      shapes.find({"name":name, "level": level},(err, result)=>{
        let features = geoJsonParser(result);
        res.send(features);
        // geo.geometry.type = result.type;
        // geo.geometry.coordinates = result.coordinates;
      });
    } else {
      getChilds(req, res);
    }
  }

exports.search = function(req,res){
  res.setHeader('Access-Control-Allow-Origin', '*');
  var data = {};
  res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
  console.log('req', req.body);
    shapes.findOne({name: req.body.name}, (err, resp) => {
      console.log(err);
      data.coordinates = resp.coordinates;
      data.type = resp.type;
      res.send(JSON.stringify(data));
      
    });
};  
getChilds = (req, res) => {
  console.log('child body is', req.body);
  var shape_id;
  level = req.body.level;
  currentLevel = req.body.currentLevel;
  name = req.body.name;
  shapes.find({"name": name, "level": currentLevel}, (err, result) => {
    shape_id = result[0].shape_id;
    shapes.find({"parent_shape_id": shape_id, "level": level}, (err, result) => {
      console.log('2nd log', shape_id);
      //also add the level in time being
      //console.log('Su',element.name);
      //console.log('Si',element.type);
      // let geo=[{"type": "Feature",
      // "properties": {
      //   "name":element.name,
      // },
      // "geometry": {
      //     "type": element.type,
      //     "coordinates": element.coordinates,
      //   }


      // }];
      let featurecollection = geoJsonParser(result);
      console.log(featurecollection);
      res.send(featurecollection);
  });
  });
};
exports.geoWithin = function(req, res) {
var name= req.body.name;
var level=req.body.level;
var coordinates1 ;
shapes.find({'name':name,'level':level},(err,result)=>{
  console.log(result[0].coordinates);
  coordinates1= result[0].coordinates;
  console.log("2nd",coordinates1);


zomato.find({"coordinates":{
  $geoWithin:{
    $geometry : {
      type : "Polygon",
      coordinates: coordinates1,
      
   }
  }
}

},function(err, res1){
  console.log("YOO",res1);
  console.log("DUCK",err);
}
  )
//console.log("New",new1);
//res.send(JSON.stringify(new1));
});
//console.log("NEW",new1);
};

