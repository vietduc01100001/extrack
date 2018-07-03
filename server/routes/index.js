const express = require('express');
const requireLogin = require('../middlewares/require-login');
const Income = require('../models/income');
const { toStringMonth } = require('../utils');

const router = express.Router();

const findIncome = (req) => {
    const findCondition = {
        _user_id: req.session._userId,
        month: req.month,
        year: req.year
    };

    return new Promise((resolve, reject) => {
        Income.findOne(findCondition, (err, income) => {
            if (err) reject(err);
            resolve(income);
        });
    });
};

const doGet = (req, res, next) => {
    const viewObj = {
        username: req.session.username,
        month: toStringMonth(req.month),
        year: req.year,
        income: 0,
        expenses: 0,
        get balance() {
            return this.income - this.expenses;
        }
    };

    findIncome(req)
        .then(income => {
            if (income) viewObj.income = income.money;
        })
        .then(() => {
            res.render('index', viewObj);
        })
        .catch(err => next(err));
};

const doPost = (req, res, next) => {
    const { month, year } = req.body;
    req.month = month;
    req.year = year;
    next();
};

router.get('/', requireLogin, doGet);
router.post('/', requireLogin, doPost, doGet);

module.exports = router;