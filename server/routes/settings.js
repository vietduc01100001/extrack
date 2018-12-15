const express = require('express');
const requireLogin = require('../middlewares/require-login');
const User = require('../models/user');
const settingsValidator = require('../validations/settings');
const { toString } = require('../utils');

const router = express.Router();

const doGet = (req, res) => {
    res.render('settings', {
        username: req.session.username,
        infoMessage: req.infoMessage || '',
        errorMessage: req.errorMessage || ''
    });
};

const changePassword = (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    const { isValid, errors } = settingsValidator(req.body);

    // input is invalid
    if (!isValid) {
        req.errorMessage = toString(errors);
        return next();
    }

    User.findById(req.session._userId, (err, user) => {
        if (err) return next(err);

        user.comparePassword(currentPassword)
            .then(isMatch => {

                // currentPassword is incorrect
                if (!isMatch) {
                    req.errorMessage = 'Current password incorrect.';
                }
                else {
                    // everything's ok, change password
                    user.password = newPassword;
                    user.save();

                    req.infoMessage = 'Password changed successfully.'
                }

                next();
            })
            .catch(err => next(err));
    });
};

router.get('/*', requireLogin, doGet);
router.post('/changepassword', requireLogin, changePassword, doGet);

module.exports = router;
