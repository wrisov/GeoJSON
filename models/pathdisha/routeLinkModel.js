var mongoose = require('mongoose');
var routeLinkSchema = mongoose.Schema({
    UP: Array,
    DN: Array,
    routeCode: String,
    stopCoord: Array
}, {collection: 'routeLinks'});

routeLinkSchema.statics.getStopsFromRoute = async function(code) {
    var returnData = await this.findOne({routeCode: code}).then((data) => {
        return data;
    });
    return returnData;
};

const PathadishaDB = mongoose.connection.useDb('Pathadisha');
module.exports = PathadishaDB.model('routeLinkModule', routeLinkSchema);