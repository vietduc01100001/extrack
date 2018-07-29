const Validator = require('validator');
const { isEmpty } = require('../utils');

module.exports = (data) => {
    const errors = {};

    if (Validator.isEmpty(data.name || '')) {
        errors.name = 'Name is required.';
    };

    if (Validator.isEmpty(data.cost || '')) {
        errors.cost = 'Cost is required.';
    };

    if (Validator.isEmpty(data.category || '')) {
        errors.category = 'Category is required.';
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};