var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
app.use(cors());

//routers
var shaperoutes = require('./routes/shaperoutes');
var login = require('./routes/login');
var zomatoRouter = require('./routes/zomatoRoutes');
var POIrouter = require('./routes/POIroutes');

var jwt = require('jsonwebtoken');
var exjwt = require('express-jwt');
var conn = require('./services/sqlDB');

var jwtMW = exjwt({
  secret: 'keyboard cat 4 ever'
});

mongoose.connect('mongodb://192.168.0.89:8080/Shapefiles').then(result => {
    console.log("Db on!");
  });

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var api = require('./routes/api');
app.use('/api', api);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//use imported routers to route
app.use('/', indexRouter);
app.use('/users',jwtMW, usersRouter);
app.use('/shapes', jwtMW, shaperoutes);
app.use('/zomato', jwtMW, zomatoRouter);
app.use('/POI', jwtMW, POIrouter);

var users = [
  {
      id: 1,
      username: 'test',
      password: 'asdf123'
  },
  {
      id: 2,
      username: 'test2',
      password: 'asdf12345'
  }
];

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
  next();
});

app.post('/signup', (req, res) => {
  
  console.log('body is', req.body);
  var {name, userName, emailId, password, companyName, companyRole} = req.body;
  var sql = 'INSERT INTO users values(\''+name+"','"+password+"','"+userName+"','"+companyName+"','"+companyRole+"','"+emailId+'\')';
  console.log('query is', sql);
  conn.query(sql, (err, resp) => {
    if(err) {throw err;}
    res.send('account created');
  });
});

app.post('/login', (req, res) => {
  const { userName, password } = req.body;
  console.log('body is', req.body);
  var sql = "SELECT username,password FROM users WHERE username = '" + userName + "'";
  console.log(sql);
  var userDB;var passDB;
  console.log('query is', sql);
  conn.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log('result', result[0].username);
    console.log('result', result[0].password);
    if (userName == result[0].username && password == result[0].password /* Use your password hash checking logic here !*/) {
      //If all credentials are correct do this
      let token = jwt.sign({ username: result[0].username }, 'keyboard cat 4 ever', { expiresIn: 129600 }); // Sigining the token
      res.json({
          sucess: true,
          err: null,
          token
      });
      var decoded = jwt.decode(token, 'keyboard cat 4 ever');
      }
      else {
          res.status(401).json({
              sucess: false,
              token: null,
              err: 'Username or password is incorrect'
          });
      }
      console.log('decode', decoded);
  });
  console.log('db', userDB, passDB);
  console.log('mila', userName, password);
  // Use your DB ORM logic here to localhost
 // I am using a simple array users which i made above
});

app.post('/getuser',jwtMW , (req, res ) => {
  data = {};
  var headers = req.headers;
  console.log('header is', headers);
  var token = headers.authorization.slice(7,);
  var userId = jwt.decode(token, 'keyboard cat 4 ever');
  data.userdetails = userId;
  res.send(JSON.stringify(data));
});


app.get('/', jwtMW /* Using the express jwt MW here */, (req, res) => {
  res.send('You are authenticated'); //Sending some response when authenticated
});

// Error handling 
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') { // Send the error rather than to show it on the console
      res.status(401).send(err);
  }
  else {
      next(err);
  }
});
module.exports = app;
