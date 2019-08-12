var express = require('express');
var villageModel = require('../models/villages');
var mongoose = require('mongoose');

exports.findVil = (req, res) => {
    villageModel.findOne({}, (err, value) => {
        res.send(value);
    });
};