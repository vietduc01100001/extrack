const Validator = require('validator');
const { isEmpty } = require('../utils');

module.exports = (data) => {
  const errors = {};

  if (!Validator.isInt(data.income || '', { min: 0 })) {
    errors.name = 'Income must be a number greater than 0.';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
