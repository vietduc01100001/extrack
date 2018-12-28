const router = require('express').Router();
const Redis = require('../redis');
const Income = require('../models/income');
const { validateEditIncome } = require('../validations');
const { toString, toStringMonth } = require('../utils');

const getIncomeEdit = async (req, res) => {
  const userId = req.session._userId;
  const { month, year } = req.params;
  try {
    const income = await Income.findOne({ user_id: userId, month, year }, 'money').lean().exec();
    res.render('income-edit', {
      dateString: `${toStringMonth(month)} ${year}`,
      month,
      year,
      income: income.money,
      errorMessage: req.errorMessage,
    });
  } catch (err) {
    res.render('purchase-error', { errorMessage: 'Error fetching income.' });
    console.log(err);
  }
};

const editIncome = async (req, res, next) => {
  const userId = req.session._userId;
  const { month, year } = req.params;
  const today = new Date();
  if (today.getMonth() + 1 !== parseInt(month) || today.getFullYear() !== parseInt(year)) {
    return res.render('purchase-error', { errorMessage: 'Cannot edit income of past months.' });
  }
  const { isValid, errors } = validateEditIncome(req.body);
  if (!isValid) {
    req.errorMessage = toString(errors);
    return next();
  }
  const update = { $set: { money: parseInt(req.body.income) }};
  try {
    await Income.findOneAndUpdate({ user_id: userId, month, year }, update).lean().exec();
    res.redirect(`/purchases/stats`);
    Redis.del(`/${userId}/incomes/${year}/${month}`);
  } catch (err) {
    res.render('income-edit', {
      dateString: `${toStringMonth(month)} ${year}`,
      month,
      year,
      income: update.$set.money,
      errorMessage: 'Error editing income.',
    });
    console.log(err);
  }
};

router.get('/:year/:month/edit', getIncomeEdit);
router.post('/:year/:month/edit', editIncome, getIncomeEdit);

module.exports = router;
