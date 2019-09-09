var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');
var app = express();
app.use(cors());
process.setMaxListeners(0);
// mongoose multiple connection
mongoose.connect('mongodb://172.17.0.1:27017/default', {
  useNewUrlParser: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('connected');
});
//
//routers
var pathadishaStops = require('./routes/pathadishaRoutes/stopsRoute');
var pathadishaHopon = require('./routes/pathadishaRoutes/hoponRoutes');
var shaperoutes = require('./routes/shapeFileRoutes/shaperoutes');
var zomatoRouter = require('./routes/shapeFileRoutes/zomatoRoutes');
var POIrouter = require('./routes/shapeFileRoutes/POIroutes');
var chartsRouter = require('./routes/charts/chartsRoute');
var pollingStationsRouter = require('./routes/shapeFileRoutes/pollingStationsRoute');
var nearRouter = require('./routes/nearRoutes/nearRoutes');
var propertyRatesRouter = require('./routes/shapeFileRoutes/propertyRatesRoute');
var censusRouter = require('./routes/shapeFileRoutes/censusRoutes');
var jwt = require('jsonwebtoken');
var exjwt = require('express-jwt');
var conn = require('./services/sqlDB');
var router = require('./routes/routes');

var jwtMW = (req, res, next) => {
  if(!req.headers.authorization){
    res.status(401).send("UnAuthorised");
    return;
  }
  var token = req.headers.authorization.split(' ')
  var decoded = jwt.decode(token[1], 'keyboard cat 4 ever');
  if(!decoded){
    next(res.status(401));
  }else{
    var username = decoded.userName;
    var sql = "SELECT userName from users where userName='"+username+"'";
    conn.query(sql, (err, result) => {
      if(err){
        next(res.status(401));
      } else{
        if(result.length > 0){
          next();
        } else{
          next(res.status(401));
        }
      }
    });
  }
};

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var satelliteRouter = require('./routes/shapeFileRoutes/satelliteRoutes');

var api = require('./routes/api');
app.use('/api', api);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//use imported routers to route
app.use('/v1', jwtMW, router);
app.use('/', indexRouter);
app.use('/users', jwtMW, usersRouter);
app.use('/shapes', jwtMW, shaperoutes);
app.use('/zomato', jwtMW, zomatoRouter);
app.use('/poi', jwtMW, POIrouter);
app.use('/stops', jwtMW, pathadishaStops);
app.use('/hopon', jwtMW, pathadishaHopon);
app.use('/charts', jwtMW, chartsRouter);
app.use('/satellite', satelliteRouter);
app.use('/near', jwtMW,nearRouter);
app.use('/polling', jwtMW, pollingStationsRouter);
app.use('/propertyrate', jwtMW,  propertyRatesRouter);
app.use('/census', jwtMW, censusRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
  next();
});

let v8 = require("v8");
let totalHeapSizeInGB = (((v8.getHeapStatistics().total_available_size) / 1024 / 1024 / 1024).toFixed(2));
console.log(`*******************************************`);
console.log(`Total Heap Size ~${totalHeapSizeInGB}GB`);
console.log(`*******************************************`);


app.post('/signup', (req, res) => {

  console.log('body is', req.body);
  var {
    name,
    userName,
    emailId,
    password,
    companyName,
    companyRole
  } = req.body;
  var sql = 'INSERT INTO users values(\'' + name + "','" + password + "','" + userName + "','" + companyName + "','" + companyRole + "','" + emailId + '\')';
  console.log('query is', sql);
  conn.query(sql, (err, resp) => {
    if (err) {
      res.send(err);
      return;
    } else{
      res.send('account created');
    }
  });
});

app.post('/login', (req, res) => {

  // var userName = req.body.username
  // var password = req.body.password

  const {
    userName,
    password
  } = req.body;

  var sql = "SELECT userName,password FROM users WHERE userName = '" + userName + "'";
  conn.query(sql, (err, result) => {
    if (err || result.length == 0) {
      res.status(500).send(err);
    }
    else{
      if (userName == result[0].userName && password == result[0].password /* Use your password hash checking logic here !*/ ) {
        //If all credentials are correct do this
        let token = jwt.sign({
          userName: result[0].userName
        }, 'keyboard cat 4 ever', {
          expiresIn: 129600
        }); // Sigining the token
        res.json({
          sucess: true,
          err: null,
          token
        });
        var decoded = jwt.decode(token, 'keyboard cat 4 ever');
      } else {
        res.status(401).json({
          sucess: false,
          token: null,
          err: 'Username or password is incorrect'
        });
      }
    }
  });
  // Use your DB ORM logic here to localhost
  // I am using a simple array users which i made above
});

app.post('/getuser', jwtMW, (req, res) => {
  data = {};
  var headers = req.headers;
  var token = headers.authorization.slice(7, );
  var userId = jwt.decode(token, 'keyboard cat 4 ever');
  data.userdetails = userId;
  res.send(JSON.stringify(data));
});

app.post('/upload', jwtMW,async (req, res) => {
  var token = req.headers.authorization.split(' ')
  var decoded = jwt.decode(token[1], 'keyboard cat 4 ever');
  var username = decoded.userName;
  await Promise.all(req.body.data.map(async (eachData) => {
    let lat = eachData.latitude;
    let long = eachData.longitude;
    let sale = eachData.sales;
    let storename = eachData.storename;
    let status = eachData.status;
    var sql = 'INSERT INTO files(latitude, longitude, storename, status, sales, username) values(\'' + lat + "', '" + long + "', '" + storename + "', '" + status + "', '" + sale + "', '" + username + '\')';
    conn.query(sql, (err, result) => {
      if(err)
        console.log(err);
    })
  }));
  res.send("Success");
})

app.post('/download', jwtMW, async (req, res) => {
  var token = req.headers.authorization.split(' ')
  var decoded = jwt.decode(token[1], 'keyboard cat 4 ever');
  var username = decoded.userName;
  var time = "SELECT updated_at FROM files WHERE username = '" + username + "' ORDER BY updated_at DESC LIMIT 1";
  conn.query(time, (err, result) => {
    if(result.length > 0){
      var last_updated = new Date(result[0]['updated_at']).toLocaleString([], {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false});
      var [date, time] = last_updated.split(' ');
      var [mm, dd, yyyy] = date.split('/');
      var [hh, min] = time.split(':');
      if(String(Number(min - 2)) < 0){
        hh = String(Number(hh - 1));
        min = '59';
      } else{
        min = String(Number(min - 2));
      }
      var dateTime = yyyy.replace(',', '') + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':00';
      console.log(hh+':'+String(Number(min - 2))+':00');
      console.log(last_updated);
      var sql = "SELECT latitude, longitude, sales, storename, status FROM files WHERE username = '" + username + "' AND updated_at >= '" + dateTime + "'";
      console.log(sql);
      conn.query(sql, (err, result) => {
        if(err){
          res.send({"success": false, "error": err});
        } 
        else{
          if(result.length > 0){
            res.send(result);
          }
          else{
            res.send({"success": true, "error": "No Data Found"});
          }
        }
      });
    }
    else{
      res.send({"success": true, "error": "No Data Found"});
    }
  });
 
})

app.post('/submit', async (req, res) => {
  var{
    name,
    email
  }  = req.body;
  var sql = "INSERT INTO feedback(name, email) VALUES('" + name + "', '" + email +"')";
  conn.query(sql, (err, result) => {
    if(err){
      res.send({"success": false, "error": err});
    }
    else{
      res.send("Success");
    }
  })
})

app.get('/', jwtMW /* Using the express jwt MW here */ , (req, res) => {
  res.send('You are authenticated'); //Sending some response when authenticated
});

// Error handling 
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') { // Send the error rather than to show it on the console
    res.status(401).send(err);
  } else {
    next(err);
  }
});
module.exports = app;