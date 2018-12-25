const Validator = require('validator');
const { isEmpty } = require('../utils');

module.exports = (data) => {
  const errors = {};

  if (!Validator.isInt(data.cost || '')) {
    errors.cost = 'Cost is not a number.';
  } else if (parseInt(data.cost) < 0) {
    errors.cost = 'Cost must be greater than 0.';
  }

  if (!Validator.isInt(data.quantity || '')) {
    errors.quantity = 'Quantity is not a number.';
  } else if (parseInt(data.quantity) < 1) {
    errors.quantity = 'Quantity must be greater than 1.';
  }

  if (Validator.isEmpty(data.description || '')) {
    errors.description = 'Description is required.';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
