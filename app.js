var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");
const sql = require("mssql");
const bcrypt = require("bcrypt");
require("dotenv").config();
const {connect, config} = require("./db.js");


//Routes
const indexRoute = require("./routes/index");
const upRoute = require("./routes/up");
const userRoute = require("./routes/users");

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '.\\myapp\\build\\')));
app.use(cors());


(async () => {
	await connect();
})();

app.set("db", sql);
app.use("/", indexRoute); //Does this do nothing??? Probably...
app.use("/up", upRoute);
app.use("/user", userRoute);



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
  //res.render('error');
});

module.exports = app;
