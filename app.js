const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // ORM

const index = require('./routes/index');

const app = express();
const port = 3200;
const dbName = 'buckets';

mongoose.connect('mongodb://localhost:27017/' + dbName);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


// handle CORS requests(cross origin resource sharing)
app.use((req, res, next) => {
  // var origin = req.headers.origin;
  // if(originWhiteList.indexOf(origin) > -1){
  //      res.setHeader('Access-Control-Allow-Origin', origin);
  // }
  res.setHeader('Access-Control-Allow-Origin', '*');
  // res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
  // var token = req.headers['Authorization'];
  // res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  // res.setHeader('Expires', '-1');
  // res.setHeader('Pragma', 'no-cache');


  next();
});

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/projects/staticSite1', express.static(path.join(__dirname, 'project1')));
app.use('/projects/staticSite2', express.static(path.join(__dirname, 'project2')));

console.log(path.join(__dirname, 'project1'));

app.use('/', index);

const usersApi = require('./api/users/users.api.js')(express);
const accountApi = require('./api/account/account.api.js')(express);

app.use('/api/users', usersApi);
app.use('/api/account', accountApi);

module.exports = app.listen(3200);
