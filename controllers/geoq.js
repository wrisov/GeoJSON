var express = require('express');
var shapesModel = require('../models/shapes');
var mongoose = require('mongoose');


/*exports.findwith = (req,res) => {
shapesModel.find({
    coordindates :{
        $geoWithin : {
            $geometry : {
                type : Polygon,
                coordindates : req.body.coordindates,
            }
        }
    }
},(err,result)=>{
    res.send(result);
})
};*/

/*exports.findwith = (req,res) => {
    shapesModel.find({name : req.body.name},(err,val)=> {
    shapesModel.find({
        coordindates : {
            $geoWithin : {
                $geometry : {
                    type : Polygon,
                    coordindates : val.body.coordindates,
                }
            }
        }
    }) 
    });
}*/