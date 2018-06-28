const express = require('express');

const router = express.Router();

const doGet = (req, res, next) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) return next(err);
            res.redirect('/getstarted');
        });
    };
};

router.get('/', doGet);

module.exports = router;