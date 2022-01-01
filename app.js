// Imports
var createError = require('http-errors');
const express = require('express')
const path    = require('path');
const app = express()
const mongoose = require("mongoose");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var indexRouter = require('./routes/dashboard');
const expressLayouts = require('express-ejs-layouts')
var logger = require('morgan');

const session = require('express-session');
const flash = require('connect-flash');

const dotenv = require("dotenv");
dotenv.config();
mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, },
  () => {
    console.log("Connected to MongoDB");
  }
);
app.use(express.static(path.join(__dirname, 'public')));

app.engine('ejs', require('express-ejs-extend')); // add this line
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use('/', indexRouter);

app.use(session({
  secret: 'secret key',
  resave: false,
  saveUninitialized: false
}));
app.use(logger('dev'));

app.use(flash());

// for hadnling the error 

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
  res.status(404).json({
    error:"page not found"
  });

  res.status(500).json({
    error:"Internal server error"
  });
  

});


// Listen on Port 5000
app.listen(process.env.port, () => console.info(`App listening on port ${process.env.port}`))

module.exports = app;
