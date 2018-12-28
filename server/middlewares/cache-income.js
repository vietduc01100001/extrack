const Redis = require('../redis');
const Income = require('../models/income');

module.exports = async (req, res, next) => {
  const userId = req.session._userId;
  const month = req.query.month || new Date().getMonth() + 1;
  const year = req.query.year || new Date().getFullYear();
  const key = `/${userId}/incomes/${year}/${month}`;
  req.month = month;
  req.year = year;
  try {
    const cache = await Redis.getAsync(key);
    if (cache) {
      req.income = cache;
      return next();
    }

    const income = await Income.findOne({ user_id: userId, month, year }, 'money').lean().exec();
    if (income) {
      req.income = income.money;
      Redis.setex(key, parseInt(process.env.CACHE_TTL), income.money);
      return next();
    }

    await Income.create({ user_id: userId, money: 0, month, year });
    req.income = 0;
    Redis.setex(key, parseInt(process.env.CACHE_TTL), 0);
    next();
  } catch (err) {
    console.log(err);
    req.income = 0;
    next();
  }
};
