var express = require('express');
var townModel = require('../../models/town');
var mongoose = require('mongoose');

exports.findTown = (req,res) => {
townModel.findOne({},(err,data)=>{
res.send(data);
});
}