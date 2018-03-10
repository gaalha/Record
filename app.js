const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const i18n = require('i18n');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');

// DATABASE CONNECTION
const mongoDB = 'mongodb://localhost/record';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//Set locale
i18n.configure({
    locales:['en', 'es'],
    directory: __dirname + '/locales',
    updateFiles: false
});

//Routes
const routes = require('./app/routes');

const app = express();

app.use(i18n.init);

// EXPRESS-VALIDATOR
app.use(expressValidator());

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', index);
//app.use('/users', users);
routes(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
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
