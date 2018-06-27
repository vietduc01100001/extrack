const express = require('express');
const User = require('../models/user');
const signUpValidator = require('../validations/signup');
const { toString } = require('../utils');

const router = express.Router();

const viewObj = {
    actionUrl: '/signup',
    buttonText: 'Sign Up'
};

// handle GET request
router.get('/', (req, res) => {
    res.render('signup-login', {
        ...viewObj,
        username: '',
        errorMessage: ''
    });
});

// handle POST request
router.post('/', (req, res) => {
    const { username, password } = req.body;
    const { isValid, errors } = signUpValidator(req.body);

    // input is invalid
    if (!isValid) {
        return res.render('signup-login', {
            ...viewObj,
            username,
            errorMessage: toString(errors)
        });
    };

    User.findOne({ username }, (err, existingUser) => {
        if (err) throw err;

        // input username exists
        if (existingUser) {
            return res.render('signup-login', {
                ...viewObj,
                username,
                errorMessage: 'Username already exists.'
            });
        };

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
});

module.exports = router;