var parseData = (data) => {
    var geo = [];
    data.forEach((element, index) => {
        geo.push({
            "type": "Feature",
            "id": element.shape_id,
            "geometry": {
                "type": element.type,
                "coordinates": element.coordinates,
            },
            "properties": {
                "name": element.name,
                "level": element.level
            }
        });
    });
    var featureCollection = {
        "type": "FeatureCollection",
        "features": geo
    };
    return featureCollection;
};

module.exports = parseData; 