var mysql = require('mysql');
con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'loginhacker',
    database: 'xpandAuth'
});

module.exports = con;