const express = require('express');
const User = require('../models/user');
const loginValidator = require('../validations/login');
const { toString } = require('../utils');

const router = express.Router();

const viewObj = {
    actionUrl: '/login',
    buttonText: 'Login'
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
    const { isValid, errors } = loginValidator(req.body);
    
    // input is invalid
    if (!isValid) {
        return res.render('signup-login', {
            ...viewObj,
            username,
            errorMessage: toString(errors)
        });
    };

    User.findOne({ username }, (err, user) => {
        if (err) throw err;

        // input username doesn't exist
        if (!user) {
            res.render('signup-login', {
                ...viewObj,
                username,
                errorMessage: 'Username incorrect.'
            });
        }
        else {
            user.comparePassword(password)
                .then(isMatch => {

                    // input password incorrect
                    if (!isMatch) res.render('signup-login', {
                        ...viewObj,
                        username,
                        errorMessage: 'Password incorrect.'
                    })
                    else {
                        // everything's ok, login
                        req.session._userId = user._id;
                        req.session.username = user.username;
                        req.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000;

                        // redirect to index
                        res.redirect('/');
                    };
                })
                .catch(err => {
                    throw err;
                });
        };
    });

});

module.exports = router;