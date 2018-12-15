const Validator = require('validator');
const { isEmpty } = require('../utils');

module.exports = (data) => {
    const errors = {};

    if (Validator.isEmpty(data.username || '')) {
        errors.username = 'Username is required.';
    }

    if (!Validator.isAlphanumeric(data.username || '')) {
        errors.username = 'Username must be alphanumeric.';
    }

    if (!Validator.isLength(data.username, { min: 3, max: 16 })) {
        errors.username = 'Username must be between 3 and 16 characters.';
    }

    if (Validator.isEmpty(data.password || '')) {
        errors.password = 'Password is required.';
    }

    if (!Validator.isLength(data.password, { min: 6 })) {
        errors.password = 'Password must be at least 6 characters.';
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};
