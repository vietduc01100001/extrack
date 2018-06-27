const express = require('express');

const router = express.Router();

// handle GET request
router.get('/', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) throw err;
            res.redirect('/getstarted');
        });
    };
});

module.exports = router;