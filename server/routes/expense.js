const express = require('express');
const requireLogin = require('../middlewares/require-login');
const { getExpense } = require('../actions/expense');

const router = express.Router();

const doGet = (req, res, next) => {
    const { category } = req.params;
    const Expense = getExpense(category);
    const findCondition = {
        month: req.query.month || req.month,
        year: req.query.year || req.year
    };

    Expense.find(findCondition, (err, expenses) => {
        if (err) return next(err);

        res.render('expense', {
            username: req.session.username,
            month: findCondition.month,
            year: findCondition.year,
            category,
            expenses
        });
    });
};

const doPost = (req, res, next) => {
    const { month, year } = req.body;
    req.month = month;
    req.year = year;
    next();
};

const doDelete = (req, res, next) => {
    const { category, _id } = req.params;
    const { month, year } = req.query;

    // not allowed to remove expense not in this month
    if (month != req.month || year != req.year) return next();

    const Expense = getExpense(category);
    Expense.findByIdAndRemove(_id, (err, deletedExpense) => {
        if (err) return next(err);
        next();
    });
};

router.get('/:category', requireLogin, doGet);
router.post('/:category', requireLogin, doPost, doGet);
router.delete('/:category/:_id', requireLogin, doDelete);

module.exports = router;