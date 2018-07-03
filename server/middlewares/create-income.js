const Income = require('../models/income');

module.exports = (req, res, next) => {
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
        };

        next();
    });
};