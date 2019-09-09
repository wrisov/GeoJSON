var demographyModel = require('../../models/demographyModel');
var shapeModel = require('../../models/shapefiles/shapes')
var dataservice = require('../../services/getData');

exports.getCumilativeData = async (req, res) => {
    var allData = {};
    await Promise.all(req.body.dict.map(async (eachArea) => {
        var dict = {
            educational: 0,
            medical: 0,
            finance: 0,
            households: 0,
            population: 0,
            male: 0,
            female: 0,
            sc: 0,
            st: 0
        };
        var specific_data = {};
        var geometry = await shapeModel.getGeometry(eachArea);
        var data = await demographyModel.getGeowithin(geometry);
        await Promise.all(data.map(async (eachData) => {
            dict.educational += eachData.educational;
            dict.medical += eachData.medical;
            dict.finance += eachData.finance;
            dict.households += eachData.households;
            dict.population += eachData.population.total;
            dict.male += eachData.population.male;
            dict.female += eachData.population.female;
            dict.sc += eachData.population.sc;
            dict.st += eachData.population.st;
            
        }));
        if(req.body.get){
            req.body.get.map((eachGet) => {
                specific_data[eachGet] = dict[eachGet]
            })
            allData[eachArea.name] = specific_data;
        } else{
            allData[eachArea.name] = dict;
        }
    }));
    res.send(allData);
};

exports.getNormalizedData = async (req, res) => {
    var allData = {};
    var max = {
        educational: 0.0,
        medical: 0.0,
        finance: 0.0,
        households: 0.0,
        population: 0.0,
        male: 0.0,
        female: 0.0,
        sc: 0.0,
        st: 0.0
    }
    var min = {
        educational: 10000000.0,
        medical: 10000000.0,
        finance: 10000000.0,
        households: 10000000.0,
        population: 100000000.0,
        male: 1000000000.0,
        female: 1000000000.0,
        sc: 1000000000.0,
        st: 1000000000.0
    };
    await Promise.all(req.body.dict.map(async (eachArea) => {
        let specific_data = {};
        var dict = {
            educational: 0.0,
            medical: 0.0,
            finance: 0.0,
            households: 0.0,
            population: 0.0,
            male: 0.0,
            female: 0.0,
            sc: 0.0,
            st: 0.0
        };
        console.log(eachArea);
        if (req.body.get){
            var geometry = await shapeModel.getGeometry(eachArea);
            var data = await demographyModel.getGeowithin(geometry);
            await Promise.all(data.map(async (eachData) => {
                dict.educational += parseFloat(eachData.educational);
                dict.medical += parseFloat(eachData.medical);
                dict.finance += parseFloat(eachData.finance);
                dict.households += parseFloat(eachData.households);
                dict.population += parseFloat(eachData.population.total);
                dict.male += parseFloat(eachData.population.male);
                dict.female += parseFloat(eachData.population.female);
                dict.sc += parseFloat(eachData.population.sc);
                dict.st += parseFloat(eachData.population.st);
                
            }));
            req.body.get.map((eachGet) => {
                specific_data[eachGet] = dict[eachGet]
            })
            allData[eachArea.name] = specific_data;
        } else{
            allData[eachArea.name] = dict;
        }
    }));
    await Promise.all(Object.keys(allData).map(async (eachData) => {
        Object.keys(allData[eachData]).map((eachKey) => {
            max[eachKey] = allData[eachData][eachKey] > max[eachKey] ? allData[eachData][eachKey] : max[eachKey];
            min[eachKey] = allData[eachData][eachKey] < min[eachKey] ? allData[eachData][eachKey] : min[eachKey];
        })
    }));
    var finalData = {}
    await Promise.all(Object.keys(allData).map(async (eachData) => {
        finalData[eachData] = 0;
        let n = Object.keys(allData[eachData]).length;
        Object.keys(allData[eachData]).map((eachKey) => {
            let a = parseFloat(allData[eachData][eachKey]);
            let b = parseFloat(max[eachKey]);
            finalData[eachData] += b == 0 ? 1/n : (parseFloat(a)/b)/n;
        }); 
    }));
    res.send(finalData);
};