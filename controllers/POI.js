var express = require('express');
var POIModel = require('../models/POI');
var mongoose = require('mongoose');
var shapes = require('../models/shapes');
exports.findPOI = (req,res) => {
    POIModel.findOne({}, (err, value) => {
        console.log(value);
        res.send(value);
    });
};


exports.geoWithin2 = function(req, res) {
    var name= req.body.name;
    var level=req.body.level;
    var coordinates1 ,coordinates2;
    var x,y,z;
    shapes.find({'name':name,'level':level},(err,result)=>{
      console.log(result[0].coordinates);
      coordinates1= result[0].coordinates;
      console.log("2nd",coordinates1);
      
      POIModel.findOne({},(err,result)=>{
        console.log("Dumbo",result.coordinates);
       }); 
    //x=(coordinates1[0][0][0]+coordinates1[0][2][0])/2;
    //y=(coordinates1[0][0][1]+coordinates1[0][1][1])/2;
    //coordinates2 = [x,y];
    
//console.log("coord",coordinates1);
   // console.log("x",x);
    //console.log("y",y);



    POIModel.find({'coordinates':{
      $geoWithin:{
        $geometry : {
          type : "Polygon",
          coordinates: coordinates1,
          
       }
      }
    }
    
    },function(err, res2){
      console.log("YOO",res2);
      console.log("DUCK",err);
      res.send(res2);
    }
      )
    //console.log("New",new1);
    //res.send(JSON.stringify(new1));
    });
    //console.log("NEW",new1);
    };
      