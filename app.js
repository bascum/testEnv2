var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");
const sql = require("mssql");
require("dotenv").config();
const {connect} = require("./db.js");

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

app.get("/", function(req, res,){
  console.log("Index being gotten");
  res.sendFile(path.join(__dirname, "myapp\\build\\index.html"));
})

app.get("/up", async function(req, res,){
  let result = await sql.query("SELECT * FROM test")
  res.send("Yes I am up x2" + result[0]);
})

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
