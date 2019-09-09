var mysql = require('mysql');
con = mysql.createConnection({
    host: '172.17.0.4',
    user: 'root',
    password: 'asusmicromax',
    database: 'xpandAuth'
});

module.exports = con;



// CREATE TABLE users (
//     name VARCHAR(200) NOT NULL,
//     password VARCHAR(200) NOT NULL,
//     username VARCHAR(200) NOT NULL,
//     companyName VARCHAR(200) NOT NULL,
//     companyRole VARCHAR(200) NOT NULL,
//     emailId VARCHAR(200) NOT NULL,
//     PRIMARY KEY (username)
//     )ENGINE=InnoDB DEFAULT CHARSET=utf8;
