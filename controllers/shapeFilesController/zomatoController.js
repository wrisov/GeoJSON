var express = require('express');
var ZomatoModel = require('../../models/shapefiles/zomato');
var shapes = require('../../models/shapefiles/shapes');
var mongoose = require('mongoose');
var geoJsonParser = require('../../services/geoJsonParser');

exports.findZomato = (req, res) => {
    ZomatoModel.findOne({
        name: req.body.name
    }, (err, value) => {
        res.send(value);
    });
};

exports.findMultiZom = (req, res) => {
    var details = [];
    var names = req.body.dict;
    names.forEach(async (element) => {
        await ZomatoModel.find({
            'Name': element.Name
        }, (err, value) => {
            details.push(value);
        });
        res.send(details);
    });
}


exports.getDetails = async (req, res) => {
    ZomatoModel.findOne({
        shape_id: req.body.id
    }).then((data) => {
        res.send(data);
    });
}

exports.findMulZom = (req, res) => {
    var coordinates = req.body.Name.map((value, index) => {
        ZomatoModel.findOne({
            Name: value
        }, (err, value1) => {
            return value1.coordinates;
        });
    });
    var coordinateArray = [];
    req.body.Name.forEach((value, index) => {
        ZomatoModel.findOne({
            Name: value
        }, (err, value1) => {
            coordinateArray[index] = value1.coordinates;
            if (index == req.body.Name.length - 1) {
                res.send(coordinateArray);
            }
        });
    });
};

exports.getCuisines = (req, res) => {
    var cuisines = [
        "Bengali",
        " Burger",
        " Fast Food",
        "Fast Food",
        "South Indian",
        " Chinese",
        "Chinese",
        " North Indian",
        "Continental",
        " Italian",
        " Mughlai",
        " Continental",
        "North Indian",
        "Biryani",
        "Mughlai",
        " Street Food",
        " Rolls",
        " Cafe",
        "Desserts",
        " Beverages",
        "Bakery",
        "Italian",
        " Desserts",
        " Thai",
        "Cafe",
        " Bakery",
        " Momos",
        "Momos",
        " Tibetan",
        "Tea",
        " Biryani",
        " South Indian",
        "Mishti",
        " Bangladeshi",
        " Bengali",
        "Finger Food",
        "Street Food",
        "Ice Cream",
        " Mexican",
        " Mishti",
        " Seafood",
        " American",
        " Sandwich",
        " Lebanese",
        " Asian",
        "Pizza",
        " Pizza",
        "Rolls",
        " Kebab",
        "Beverages",
        " Healthy Food",
        "Sandwich",
        " BBQ",
        "Roast Chicken",
        "American",
        "Assamese",
        " Hot dogs",
        " Cantonese",
        "Gujarati",
        "BBQ",
        "Japanese",
        " Sushi",
        " Japanese",
        " Ice Cream",
        "Burger",
        "Tibetan",
        " Afghan",
        " Singaporean",
        "Mexican",
        "Awadhi",
        " Awadhi",
        "Kebab",
        " Burmese",
        "European",
        " Indian",
        " Nepalese",
        " Juices",
        "Juices",
        " Salad",
        " Finger Food",
        "Salad",
        "Bihari",
        "Steak",
        " Rajasthani",
        " Mithai",
        "Indian",
        " Mangalorean",
        "Mediterranean",
        "Korean",
        "North Eastern",
        "Asian",
        " Mediterranean",
        "Bar Food",
        "Lebanese",
        "Rajasthani",
        " Tea",
        " Coffee",
        "Bubble Tea",
        "Seafood",
        " Mongolian",
        " Parsi",
        " Belgian",
        " Bar Food",
        "Afghan",
        " North Eastern",
        "Wraps",
        "Burmese",
        " Modern Indian",
        "Mithai",
        " Roast Chicken",
        "Kerala",
        " Paan",
        " European",
        " Hyderabadi",
        "Raw Meats",
        " Wraps",
        "Healthy Food",
        " Bihari",
        " Steak",
        " Turkish",
        " Fried Chicken",
        "Modern Indian",
        "Arabian",
        "Kashmiri",
        "Paan",
        "Thai",
        " Raw Meats",
        " Bubble Tea",
        " French",
        " Gujarati",
        " Malaysian",
        "Turkish",
        " Odia",
        " Maharashtrian",
        " Konkan",
        " Goan",
        "Nepalese",
        "Bangladeshi",
        "Goan",
        "Parsi",
        "Hyderabadi",
        " Korean",
        "Lucknowi",
        "Naga",
        " Poké",
        " Vietnamese",
        "Sushi",
        "Spanish",
        " Arabian",
        " Lucknowi",
        "Maharashtrian",
        " Tex-Mex",
        " Middle Eastern",
        " Kerala",
        " Andhra",
        " Indonesian",
        " Frozen Yogurt",
        "Middle Eastern",
        "Cantonese",
        "Coffee",
        " Kashmiri",
        "Vietnamese",
        "French",
        "Brazilian",
        "Andhra",
        "Ethiopian",
        "Armenian",
        " Spanish",
        " Assamese",
        "Belgian",
        " Chettinad",
        "Frozen Yogurt",
        "Odia",
        "Portuguese",
        " Sri Lankan",
        " Iranian",
        " South American",
        " German",
        "Poké",
        " Oriental",
        " Pakistani",
        "Malaysian",
        " British",
        " Falafel",
        " Moroccan",
        " Charcoal Chicken",
        "Russian",
        "_",
        " Cuisine Varies",
        " Naga",
        "Charcoal Chicken",
        " Tamil",
        "Pakistani",
        "Cuisine Varies",
        "Iranian",
        "Chettinad",
        " African",
        " Peruvian",
        " Israeli",
        "Mangalorean",
        " Patisserie",
        "Singaporean",
        "Hot dogs",
        " Greek",
        " Panini",
        "Malwani",
        "Konkan",
        " Sindhi",
        " Malwani",
        "Sindhi",
        "Tex-Mex",
        " Portuguese",
        "Egyptian",
        "South American",
        " Vegetarian",
        "Bohri",
        " Cafe Food",
        "British",
        " Grill",
        " Soul Food",
        "Indonesian",
        " Filipino",
        " Australian",
        " Egyptian",
        " Chili",
        "Sri Lankan",
        "German",
        " Brazilian",
        " Coffee and Tea",
        " Fusion"
    ];
    res.send({
        filters: cuisines
    })
};

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

exports.geoWithin = function (req, res) {
    var lev1 = req.body.dict;
    var resorg = [];
    res.send(lev1.map(function (element) {
        var name = element.name;
        var level = element.level;
        var coordinates1;
        shapes.find({
            'name': name,
            'level': level
        }, (err, result) => {
            coordinates1 = result[0].coordinates;


            ZomatoModel.find({
                "coordinates": {
                    $geoWithin: {
                        $geometry: {
                            type: "Polygon",
                            coordinates: coordinates1,

                        }
                    }
                }

            }, function (err, res1) {
                let featurecollection = geoJsonParser(res1);
                resorg.push(featurecollection);


            })
        }); //router.post('/getchild',shape_controller.getChilds);
        return resorg;

    }));
};

//
exports.getZomatoCoordinates = async function (req, res) {
    if (req.body.dict.length === 0) {
        var featureCollection = {
            "type": "FeatureCollection",
            "features": []
        }
        res.send(featureCollection);
    } else {
        req.body.filter = req.body.filter ? req.body.filter : {};
        var dict = req.body.dict;
        var points = await Promise.all(dict.map(async (element) => {
            var geometry = await shapes.getGeometry({name: element.name, level: element.level});
            var zomatoPoints = await ZomatoModel.findByFilter(req.body.filter, geometry);
            return zomatoPoints;
        }));
        var geo = [];
        points.forEach((element) => {
            if (element === null) {
                return featureCollection;
            }
            element.forEach((elem, index) => {
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
                    }
                });
            });
        });
        res.send({
            "type": "FeatureCollection",
            "features": geo
        });
    }
}




exports.findMany = (req, res) => {


    var names = req.body.dict;
    const out1 = (names.map(function (element) {
        var name = element.name;
        var field = element.field;
        ZomatoModel.find({
            'Name': name
        }, (err, result) => {
            if (field === 'Votes')
                return result[0].Votes;
            if (field === 'CostforTwo')
                return result[0].CostforTwo;
            if (field === 'Ratings')
                return result[0].Ratings;



        });

    }));
    res.send(out1);
}


exports.getChart = async function (req, res) {
    if (req.body === null) {
        var featureCollection = {
            "type": "FeatureCollection",
            "features": []
        }
        res.send(featureCollection);
    }
    if (req.body.dict.length === 0) {
        var featureCollection = {
            "type": "FeatureCollection",
            "features": []
        }
        res.send(featureCollection);
    } else {
        req.body.filter = req.body.filter ? req.body.filter : {};
        var dict = req.body.dict;
        var points = await Promise.all(dict.map(async (element) => {
            var geometry = await shapes.getGeometry({name: element.name, level: element.level});
            var zomatoPoints = await ZomatoModel.findByFilter(req.body.filter, geometry);
            return zomatoPoints;
        }));
        var geo = [];
        var allCusines = [];
        points.forEach((element) => {
            if (element === null) {
                return featureCollection;
            }
            element.forEach((elem, index) => {
                // console.log(elem);
                // cusinesArr.push(elem.cuisines)
                allCusines.push(
                    elem.cuisines,
                )

                // console.log(allCusines);

            });
        });


        allCusines = allCusines.flat(1);
        allCusines = allCusines.map(el => el.trim());
        const s = new Set(allCusines);
        // const values = s.values();
        const search = Array.from(s.values());
        const resul = []

        for (const s of search) {
            let count = allCusines.reduce((n, x) => n + (x === s), 0);
            resul.push({
                "Cusine": s,
                "count": count
            });
        }

        res.send({
            "cusinesArr": resul
        });
    }
}