var shapeModel = require('../models/shapefiles/shapes');

exports.getCumilativeData = async (model, dict, get) => {
    var allData = {};
    await Promise.all(dict.map(async (eachArea) => {
        var dict = {}
        var geometry = await shapeModel.getGeometry(eachArea);
        var data = await model.getGeowithin(geometry);
        let tmp = data[0].toObject()
        console.log(console.log(Object.getOwnPropertyNames(tmp)));
        if(get == null){
            var keys = Object.keys(tmp);
        } else{
            var keys = get;
        }
        keys.map((eachGet) => {
            dict[eachGet] = 0;
        });
        console.log(dict);
        await Promise.all(data.map(async (eachData) => {
            keys.map((eachGet) => {
                dict[eachGet] += eachData[eachGet];
            });
        }));
        allData[eachArea.name] = dict;
    }));
    return allData;
}