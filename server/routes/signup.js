const router = require('express').Router();
const User = require('../models/user');
const { validateSignUp } = require('../validations');
const { toString } = require('../utils');

const viewObj = {
  actionUrl: '/signup',
  buttonText: 'Sign Up'
};

const doGet = (req, res) => {
  res.render('signup-login', {
    ...viewObj,
    username: req.username || '',
    errorMessage: req.errorMessage || ''
  });
};

const doPost = (req, res, next) => {
  const { username, password } = req.body;
  const { isValid, errors } = validateSignUp(req.body);

  if (!isValid) {
    req.username = username;
    req.errorMessage = toString(errors);
    return next();
  }

  User.findOne({ username }, (err, existingUser) => {
    if (err) return next(err);

    if (existingUser) {
      req.username = username;
      req.errorMessage = 'Username already exists.';
      return next();
    }

    const user = new User({ username, password });
    user.save();

    req.session._userId = user._id;
    req.session.username = user.username;
    req.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000;

    res.redirect('/');
  });
};

router.get('/', doGet);
router.post('/', doPost, doGet);

module.exports = router;
