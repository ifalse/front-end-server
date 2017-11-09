var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var test = require('./routes/test');
// var login = require('./routes/login');
// var register = require('./routes/register');
// var home = require('./routes/home');
// var logout = require('./routes/logout');

//新增multer和mongoose  
//var multer = require('multer');
var mongoose = require('mongoose');

global.dbHandel = require('./database/dbHandel');
global.db = mongoose.connect("mongodb://localhost:27017/front-end-search", function(err) {
  if (err) throw err;
  console.log('Successfully connected to MongoDB');
});

//引用express-session  
var session = require('express-session');
var app = express();
app.use(session({
  secret: 'secret',
  cookie: {
    maxAge: 1000 * 60 * 30
  }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(multer()); //写法不兼容
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.locals.user = req.session.user; //从session获取user对象  
  var err = req.session.error; //获取错误信息  
  delete req.session.error;
  res.locals.message = ""; //展示信息的message  
  if (err) {
    res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red">' + err + '</div>';
  }
  next(); //中间件传递  
});

app.use('/', index);
app.use('/users', users);
app.use('/test', test);

app.use('/login', index);
app.use('/register', index);
app.use('/home', index);
app.use('/logout', index);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;