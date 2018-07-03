const express = require('express');
const requireLogin = require('../middlewares/require-login');
const addExpenseValidator = require('../validations/add-expense');
const { createExpense } = require('../actions/expense');
const { toString } = require('../utils');

const router = express.Router();

const doGet = (req, res) => {
    res.render('add-expense', {
        username: req.session.username,
        name: req.name,
        cost: req.cost,
        category: req.category || req.query.category,
        errorMessage: req.errorMessage
    });
};

const doPost = (req, res, next) => {
    const { name, cost, category } = req.body;
    const { isValid, errors } = addExpenseValidator(req.body);

    // input is invalid
    if (!isValid) {
        req.name = req.body.name;
        req.cost = req.body.cost;
        req.category = category;
        req.errorMessage = toString(errors);
        return next();
    };
    
    const expense = createExpense(category, {
        name,
        cost,
        date: req.date,
        month: req.month,
        year: req.year,
        _user_id: req.session._userId
    });
    expense.save();

    res.redirect(`/expense/${category}`);
};

router.get('/', requireLogin, doGet);
router.post('/', requireLogin, doPost, doGet);

module.exports = router;