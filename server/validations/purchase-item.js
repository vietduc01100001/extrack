const Validator = require('validator');
const { isEmpty } = require('../utils');

module.exports = (data) => {
  const errors = {};

  if (data.items.length === 0) {
    errors.items = 'Purchase items are required.';
  }

  data.items.forEach(item => {
    if (!Validator.isInt(item.cost || '')) {
      errors.cost = 'Cost is not a number.';
    } else if (parseInt(item.cost) < 0) {
      errors.cost = 'Cost must be greater than 0.';
    }

    if (!Validator.isInt(item.quantity || '')) {
      errors.quantity = 'Quantity is not a number.';
    } else if (parseInt(item.quantity) < 1) {
      errors.quantity = 'Quantity must be greater than 1.';
    }
  });

  if (Validator.isEmpty(data.description || '')) {
    errors.description = 'Description is required.';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
