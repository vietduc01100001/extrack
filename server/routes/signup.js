const express = require('express');
const User = require('../models/user');
const signUpValidator = require('../validations/signup');
const { toString } = require('../utils');

const router = express.Router();

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
    const { isValid, errors } = signUpValidator(req.body);

    // input is invalid
    if (!isValid) {
        req.username = username;
        req.errorMessage = toString(errors);
        return next();
    }

    User.findOne({ username }, (err, existingUser) => {
        if (err) return next(err);

        // input username exists
        if (existingUser) {
            req.username = username;
            req.errorMessage = 'Username already exists.';
            return next();
        }

        // everything's ok, create new user
        const user = new User({ username, password });
        user.save();

        // login
        req.session._userId = user._id;
        req.session.username = user.username;
        req.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000;

        // redirect to index
        res.redirect('/');
    });
};

router.get('/', doGet);
router.post('/', doPost, doGet);

module.exports = router;
