const createError = require('http-errors');
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const database = require('./server/database');
const axios = require('./server/axios');

const indexRouter = require('./server/routes/index');
const signUpRouter = require('./server/routes/signup');
const loginRouter = require('./server/routes/login');
const logoutRouter = require('./server/routes/logout');
const settingsRouter = require('./server/routes/settings');
const incomeRouter = require('./server/routes/income');
const addExpenseRouter = require('./server/routes/add-expense');
const expenseRouter = require('./server/routes/expense');
const spendingAssistantRouter = require('./server/routes/spending-assistant');

const app = express();

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

database.init();
axios.init();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: database.connection
  })
}));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ['\'self\''],
      scriptSrc: ['\'self\'', '\'unsafe-inline\''],
    },
  },
  referrerPolicy: true,
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/signup', signUpRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/settings', settingsRouter);
app.use('/income', incomeRouter);
app.use('/addexpense', addExpenseRouter);
app.use('/expense', expenseRouter);
app.use('/spending-assistant', spendingAssistantRouter);

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
