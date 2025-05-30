var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var paymentRouter = require('./routes/payment');
var usersRouter = require('./routes/users');
const register = require("./routes/register")
const signIn = require("./routes/signin")
const dashboard = require("./routes/dashboard")
const dailyBonus = require("./routes/daily-bonus")

// creating connection to the database
/* 
  this connection is once and it will try connecting to Global database if failed it will try to local instantly
*/
const InitDatabase = require("./utility/database/init");
InitDatabase()

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(session())
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/payment', paymentRouter);
app.use('/register', register);
app.use('/signin', signIn);
app.use('/dashboard', dashboard);
app.use('/daily-bonus', dailyBonus);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
