const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const database = require('./server/database');

const indexRouter = require('./server/routes/index');
const signUpRouter = require('./server/routes/signup');
const loginRouter = require('./server/routes/login');
const logoutRouter = require('./server/routes/logout');
const settingsRouter = require('./server/routes/settings');
const incomeRouter = require('./server/routes/income');
const addExpenseRouter = require('./server/routes/add-expense');
const expenseRouter = require('./server/routes/expense');

const app = express();

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

// initialize database
database.init();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// session setup
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: database.connection
  })
}));

// other setups
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.disable('x-powered-by');

// routing
app.use('/', indexRouter);
app.use('/signup', signUpRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/settings', settingsRouter);
app.use('/income', incomeRouter);
app.use('/addexpense', addExpenseRouter);
app.use('/expense', expenseRouter);

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
