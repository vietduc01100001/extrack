const express = require('express');
const requireLogin = require('../middlewares/require-login');
const Income = require('../models/income');

const router = express.Router();

const doGet = (req, res, next) => {
    const findCondition = {
        _user_id: req.session._userId,
        month: req.month,
        year: req.year
    };

    Income.findOne(findCondition, (err, income) => {
        if (err) return next(err);

        // if this month income hasn't been created, do it
        if (!income) {
            const income = new Income({
                money: 0,
                month: req.month,
                year: req.year,
                _user_id: req.session._userId
            });

            income.save();
            res.redirect('/income');
            return;
        };

        res.render('income', {
            username: req.session.username,
            money: income.money
        });
    });
};

const doPost = (req, res) => {
    const findCondition = {
        _user_id: req.session._userId,
        month: req.month,
        year: req.year
    };

    Income.findOne(findCondition, (err, income) => {
        if (err) return next(err);
        if (income) {
            income.money = req.body.money;
            income.save();
        };
        res.redirect('/');
    });
};

router.get('/', requireLogin, doGet);
router.post('/', requireLogin, doPost);

module.exports = router;