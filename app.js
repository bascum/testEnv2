var createError = require('http-errors'); //
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser'); //
var logger = require('morgan'); //
const session = require("express-session");
const cors = require("cors");
const sql = require("mssql");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const { connect, config } = require("./db.js");


//Routes
const indexRoute = require("./routes/index"); //Testing
const upRoute = require("./routes/up"); // Testing
const userRoute = require("./routes/users");
const ticketRoute = require("./routes/ticket");
const printerRoute = require("./routes/printer");

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './Client/dist/')));
app.use(cors());
app.use(session({
  secret: "Ticket-Secret",
  resave: false,
  saveUninitialized: false,
}));


(async () => {
  await connect();
})();

app.set("db", sql);
app.use("/", indexRoute); //Does this do nothing??? Probably...
app.use("/up", upRoute);
app.use("/user", userRoute);
app.use("/ticket", ticketRoute);
app.use("/printer", printerRoute);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');
});

module.exports = app;
