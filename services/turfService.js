var turf = require('@turf/turf');

exports.getPolygonsCoveringMoreThanFiftyPercent = (parentPolygonCoordinates, childPolygons) => {
    var sendArr = [];
    var parentPolygonObject = turf.polygon(parentPolygonCoordinates);
    childPolygons.forEach((elements, index) => {
        var childPolygonObject = turf.polygon(elements.geometry.coordinates);
        var area = turf.area(childPolygonObject);
        var difference = turf.difference(childPolygonObject, parentPolygonObject);
        if (difference) {
            let diffArea = turf.area(difference);
            let percentage = diffArea / area * 100;
            if (percentage > 50) {
                childPolygons[index] = null;
            }
        }
    });
    childPolygons.forEach((elem) => {
        var sendPols = {}
        if (elem) {
            sendPols.type = 'Feature';
            sendPols.geometry = elem.geometry;
            sendPols.properties = elem.properties;
            sendArr.push(sendPols);
        }
    });
    return sendArr;
}