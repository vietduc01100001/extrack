const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const createError = require('http-errors');
const path = require('path');

const MongoDB = require('./server/mongodb');
const axios = require('./server/axios');
const routes = require('./server/routes');

const app = express();

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

MongoDB.init();
axios.init();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ['\'self\''],
      scriptSrc: ['\'self\'', '\'unsafe-inline\''],
    },
  },
  referrerPolicy: true,
}));

app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: MongoDB.connection
  })
}));

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

routes(app);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
