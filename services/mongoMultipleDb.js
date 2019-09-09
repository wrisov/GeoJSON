var Mongoose = require('mongoose').Mongoose;
var instance1 = new Mongoose();
var conn1 = instance1.createConnection('mongodb://0.tcp.ngrok.io:19201/Shapefiles');
var instance2 = new Mongoose();
var conn2 = instance2.createConnection('mongodb://0.tcp.ngrok.io:19201/Pathadisha');
