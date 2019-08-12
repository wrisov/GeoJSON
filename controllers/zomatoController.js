var express = require('express');
var ZomatoModel = require('../models/zomato');
var shapes=require('../models/shapes');
var mongoose = require('mongoose');
var geoJsonParser = require('../services/geoJsonParser');

exports.findZomato = (req,res) => {
    ZomatoModel.findOne({name : req.body.name}, (err, value) => {
        res.send(value);
    });
};
 
exports.findMultiZom = (req,res)=> {
    var details=[];
    var names = req.body.dict;
    names.forEach(async (element) => {
    await ZomatoModel.find({'Name': element.Name},(err,value)=>{
        details.push(value);
       // console.log("val",value);
       // console.log("Inside",details);
  
    })
    console.log("Sum",details);
    res.send(details);
    });
    console.log("Outside",details);
     
}


exports.findMulZom = (req,res) => {
    console.log('req body is', req.body);
    var coordinates = req.body.Name.map((value,index)=>{
        console.log('value is', value);
        ZomatoModel.findOne({Name : value},(err, value1)=>{
            return value1.coordinates;
        });
    });
    var coordinateArray = [];
    console.log('cordinate is', req.body.Name.forEach((value,index)=>{
        ZomatoModel.findOne({Name : value},(err, value1)=>{
            console.log('value is', value1.coordinates);
            coordinateArray[index] = value1.coordinates;
            console.log('index is', index);
            console.log('length is', req.body.Name.length);
            if (index == req.body.Name.length-1)
            {
                res.send(coordinateArray);
            }
        });
        console.log('cordinateArr is', coordinateArray);
    }));
};

exports.getCuisines = (req, res) => {
    var cuisines = [];
    console.log('inside filer func');
    ZomatoModel.find({}, (err, result) => {
        result.forEach((element, index) => {
            element.cuisines.forEach((elem, ind) => {
                let flag = 0;
                cuisines.forEach((ele) => {
                    if (ele === elem) {flag = 1}
                });
                if (flag === 0) {
                    cuisines.push(elem);
                    return 0;
                }
            });
        });
        console.log('cuisines are', cuisines);
        res.send({filters: cuisines});
    });
};

// exports.cuisinesFilter = (req, res) => {
//     var cuisineResults = [];
//     filterConditions = req.body.filters;
//     var costfortwo = false;
//     var votes = false;
//     var ratings = false;
//     var votes = {};
//     var costfortwo = {};
//     var ratings = {};
//     var polygonCordinates = [];
    
//     var lev1=req.body.dict;
//     var resorg=[];
//     lev1.forEach(function(element){
//     var name= element.name;
//     var level=element.level;
//     var coordinates1 ;
//     shapes.find({'name':name,'level':level},(err,result)=>{
//     //   console.log(result[0].coordinates);
//       coordinates1= result[0].coordinates;
//       console.log("cordinate is",coordinates1);
//       polygonCordinates.push(coordinates1);
    
    
//     ZomatoModel.find({"coordinates":{
//       $geoWithin:{
//         $geometry : {
//           type : "Polygon",
//           coordinates: coordinates1,
          
//        }
//       }
//     }
    
//     },function(err, res1){
//     //   console.log("YOO",res1);
//     //   console.log("DUCK",err);
      
//       let featurecollection = geoJsonParser(res1);
//       resorg.push(featurecollection);
//     }
//       )
//       console.log('array is', resorg);
//     //console.log("New",new1);
//     //res.send(JSON.stringify(new1));
//     });//router.post('/getchild',shape_controller.getChilds);
//     //console.log("NEW",new1);
//     });

//     votes.min = req.body.votes ? req.body.votes.min : 0;
//     votes.max = req.body.votes ? req.body.votes.max : 10000000;
//     costfortwo.min = req.body.costfortwo ? req.body.costfortwo.min : 0;
//     costfortwo.max = req.body.costfortwo ? req.body.costfortwo.max : 10000000;
//     ratings.min = req.body.ratings ? req.body.ratings.min : 0;
//     ratings.max = req.body.ratings ? req.body.ratings.max : 10;
//     console.log('votes', votes);
//     console.log('cost for two', costfortwo);
//     console.log('ratings', ratings);
//     // filterConditions.forEach((element) => {
        
//     // });
//     cuisine = req.body.cuisine;
//     polygonCordinates.forEach((coord) => {
//         ZomatoModel.find({"coordinates":{
//             $geoWithin:{
//               $geometry : {
//                 type : "Polygon",
//                 coordinates: coord,
                
//              }
//             }
//           }
          
//           }).where('Votes').gte(votes.min).lte(votes.max).where('CostforTwo').gte(costfortwo.min).lte(costfortwo.max).where('Ratings').gte(ratings.min).lte(ratings.max).exec((err, result) => {
//               result.forEach((element) => {
//                   element.Cuisines.forEach((elem) => {
//                       if (elem === cuisine) {
//                           resorg.push(element);
                          
//                       }
//                   });
//               });
//               res.send(geoJsonParser(resorg));
//           });
//     });
// }

exports.range = (req, res) => {
    var queryname = '';
    var body = {};
    if (req.body.name === 'costfortwo') {
        queryname = 'CostforTwo';
    }
    if (req.body.name === 'votes') {
        queryname = 'Votes';
    }
    if (req.body.name === 'ratings') {
        queryname = 'Ratings';
    }
    ZomatoModel.where(queryname).gte(req.body.min).lte(req.body.max).exec((err, result) => {
        res.send(geoJsonParser(result));
    });
}

exports.geoWithin = function(req, res) {
    var lev1=req.body.dict;
    var resorg=[];
    res.send(lev1.map(function(element){
    var name= element.name;
    var level=element.level;
    var coordinates1 ;
    shapes.find({'name':name,'level':level},(err,result)=>{
      //console.log(result[0].coordinates);
      coordinates1= result[0].coordinates;
      //console.log("cordinate is",coordinates1);
    
    
    ZomatoModel.find({"coordinates":{
      $geoWithin:{
        $geometry : {
          type : "Polygon",
          coordinates: coordinates1,
          
       }
      }
    }
    
    },function(err, res1){
       //console.log("YOO",res1.coordinates);
    //   console.log("DUCK",err);
      //res.send(res1.coordinates);
      //res1.forEach(function(element){
         // console.log(element.coordinates);
        let featurecollection = geoJsonParser(res1);
        resorg.push(featurecollection);

      
    }
      )
      
      //console.log('array is', resorg);
    //console.log("New",new1);
    //res.send(JSON.stringify(new1));
    });//router.post('/getchild',shape_controller.getChilds);
    console.log("NEW",resorg);
    return resorg;

}));
}

exports.geoWithin2 = async function(req, res) {
    console.log('body is',req.body);
    if(req.body === null)
    {
        var featureCollection = {
            "type": "FeatureCollection",
            "features": []
        }
        console.log("Feature",featureCollection);
    res.send(featureCollection);
    }
    if(req.body.dict.length === 0)
    {
     
        var featureCollection = {
            "type": "FeatureCollection",
            "features": []
        }
        console.log("Feature",featureCollection);
    res.send(featureCollection);
      
    }
    
    req.body.filter = req.body.filter ? req.body.filter : {};
    var cuisine = req.body.filter.cuisines ? req.body.filter.cuisines : null;
    var dict = req.body.dict;
    var votes = {}, costfortwo ={}, ratings = {};
    votes.min = Number(req.body.filter.votes ? req.body.filter.votes.min : 0);
    votes.max = Number(req.body.filter.votes ? req.body.filter.votes.max : 10000000);
    costfortwo.min = req.body.filter.costfortwo ? req.body.filter.costfortwo.min : 0;
    costfortwo.max = req.body.filter.costfortwo ? req.body.filter.costfortwo.max : 10000000;
    ratings.min = Number(req.body.filter.rating ? req.body.filter.rating.min : 0);
    ratings.max = Number(req.body.filter.rating ? req.body.filter.rating.max : 10);
    console.log('ratings are', ratings);
    var points = await Promise.all(dict.map(async (element) => {
            var coords = await shapes.find({"name": element.name, "level": element.level}).then((result) => {
                return result[0].coordinates;
            });
            var zomatoPoints = await ZomatoModel.find({"coordinates":{
                $geoWithin:{
                        $geometry : {
                                    type : "Polygon",
                                    coordinates: coords,
                    
                                    }
                            }
                        }
                    }).where('votes').gte(votes.min).lte(votes.max).where('costForTwo').gte(costfortwo.min).lte(costfortwo.max).where('ratings').gte(ratings.min).lte(ratings.max).then((result) => {
                        console.log('cuisine', cuisine);
                        if (cuisine) {
                            result.forEach((elemResult) => {
                                elemResult.cuisines.forEach((elem) => {
                                    if (elem === cuisine) {
                                        console.log('cuisine exist');
                                        return elemResult;
                                    }
                                });
                            });
                        } else {
                            console.log('no cuisine exist');
                            return result;
                        }
                    });
            return zomatoPoints;
    }));
    res.send(points.map((element) => {
        if(element === null)
        {var featureCollection = {
            "type": "FeatureCollection",
            "features": []
        }
        console.log("Feature",featureCollection);
        return featureCollection; 
        }
        return geoJsonParser(element);
    }));
}




exports.findMany = (req,res)=> {
    

    var names = req.body.dict;
   const out1=(names.map(function(element){
        var name= element.name;
        console.log('name',name);
        var field = element.field;
        console.log('fields',field);
        ZomatoModel.find({'Name':name},(err,result)=>{
         console.log("Name",result[0].Name);
        if(field ==='Votes')
            return result[0].Votes;
        if(field === 'CostforTwo')
            return result[0].CostforTwo;
        if(field === 'Ratings')
            return result[0].Ratings;

        
  
        });

}));
console.log("put",out1);
res.send(out1);
}