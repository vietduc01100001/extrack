const express = require('express');
const requireLogin = require('../middlewares/require-login');
const { toStringMonth } = require('../utils');

const router = express.Router();

const doGet = (req, res) => {
    const d = new Date();

    res.render('index', {
        username: req.session.username,
        month: toStringMonth(d.getMonth() + 1),
        year: d.getFullYear(),
        income: 0,
        expenses: 0,
        get balance() {
            return this.income - this.expenses;
        }
    });
};

router.get('/', requireLogin, doGet);

module.exports = router;