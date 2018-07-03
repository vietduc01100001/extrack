const expense = require('../models/expense');

exports.getExpense = (category) => {
    if (category === 'food') return expense.Food;
    if (category === 'house') return expense.House;
    if (category === 'health') return expense.Health;
    if (category === 'transport') return expense.Transport;
    if (category === 'clothes') return expense.Clothes;
    if (category === 'entertainment') return expense.Entertainment;
    if (category === 'others') return expense.Others;
};

exports.createExpense = (category, doc) => {
    if (category === 'food') return new expense.Food(doc);
    if (category === 'house') return new expense.House(doc);
    if (category === 'health') return new expense.Health(doc);
    if (category === 'transport') return new expense.Transport(doc);
    if (category === 'clothes') return new expense.Clothes(doc);
    if (category === 'entertainment') return new expense.Entertainment(doc);
    if (category === 'others') return new expense.Others(doc);
};

exports.countTotalExpenses = (docs, category) => {
    return docs.map(doc => exports.createExpense(category, doc).cost)
        .reduce((acc, cval) => acc + cval, 0);
};