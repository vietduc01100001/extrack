const express = require('express');
const requireLogin = require('../middlewares/require-login');

const router = express.Router();

// handle GET request
router.get('/', requireLogin, (req, res) => {
    res.render('index', {
        username: req.session.username
    });
});

module.exports = router;