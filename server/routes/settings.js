const router = require('express').Router();
const User = require('../models/user');
const { validateSettings } = require('../validations');
const { toString } = require('../utils');

const doGet = (req, res) => {
  res.render('settings', {
    username: req.session.username,
    infoMessage: req.infoMessage || '',
    errorMessage: req.errorMessage || ''
  });
};

const changePassword = (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const { isValid, errors } = validateSettings(req.body);

  if (!isValid) {
    req.errorMessage = toString(errors);
    return next();
  }

  User.findById(req.session._userId, (err, user) => {
    if (err) return next(err);

    user.comparePassword(currentPassword)
      .then(isMatch => {

        if (!isMatch) {
          req.errorMessage = 'Current password incorrect.';
        } else {
          user.password = newPassword;
          user.save();

          req.infoMessage = 'Password changed successfully.'
        }

        next();
      })
      .catch(err => next(err));
  });
};

router.get('/', doGet);
router.post('/password', changePassword, doGet);

module.exports = router;
