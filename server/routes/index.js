const express = require('express');
const requireLogin = require('../middlewares/require-login');
const createIncome = require('../middlewares/create-income');
const Income = require('../models/income');
const expense = require('../models/expense');
const { countTotalExpenses } = require('../actions/expense');
const { toStringMonth } = require('../utils');

const router = express.Router();

const findIncome = (req) => {
    return Income.findOne({
        _user_id: req.session._userId,
        month: req.month,
        year: req.year
    }).lean();
};

const findExpenses = (model, req) => {
    return model.find({
        _user_id: req.session._userId,
        month: req.month,
        year: req.year
    }).lean();
}

const doGet = async (req, res, next) => {
    const incomeDoc = await findIncome(req).exec();
    const foodExpensesDocs = await findExpenses(expense.Food, req).exec();
    const houseExpensesDocs = await findExpenses(expense.House, req).exec();
    const healthExpensesDocs = await findExpenses(expense.Health, req).exec();
    const transportExpensesDocs = await findExpenses(expense.Transport, req).exec();
    const studyingExpensesDocs = await findExpenses(expense.Studying, req).exec();
    const entertainmentExpensesDocs = await findExpenses(expense.Entertainment, req).exec();
    const othersExpensesDocs = await findExpenses(expense.Others, req).exec();
    
    const income = new Income(incomeDoc).money;
    const foodExpenses = countTotalExpenses(foodExpensesDocs, 'food');
    const houseExpenses = countTotalExpenses(houseExpensesDocs, 'house');
    const healthExpenses = countTotalExpenses(healthExpensesDocs, 'health');
    const transportExpenses = countTotalExpenses(transportExpensesDocs, 'transport');
    const studyingExpenses = countTotalExpenses(studyingExpensesDocs, 'studying');
    const entertainmentExpenses = countTotalExpenses(entertainmentExpensesDocs, 'entertainment');
    const othersExpenses = countTotalExpenses(othersExpensesDocs, 'others');

    res.render('index', {
        username: req.session.username,
        month: req.month,
        strMonth: toStringMonth(req.month),
        year: req.year,
        income,
        foodExpenses,
        houseExpenses,
        healthExpenses,
        transportExpenses,
        studyingExpenses,
        entertainmentExpenses,
        othersExpenses,
        get totalExpenses() {
            return this.foodExpenses
                + this.houseExpenses
                + this.healthExpenses
                + this.transportExpenses
                + this.studyingExpenses
                + this.entertainmentExpenses
                + this.othersExpenses;
        },
        get balance() {
            return this.income - this.totalExpenses;
        }
    });
};

const doPost = (req, res, next) => {
    const { month, year } = req.body;
    req.month = month;
    req.year = year;
    next();
};

router.get('/', requireLogin, createIncome, doGet);
router.post('/', requireLogin, doPost, doGet);

module.exports = router;