const Validator = require('validator');
const { isEmpty } = require('../utils');

module.exports = (data) => {
  const errors = {};

  if (Validator.isEmpty(data.name || '')) {
    errors.name = 'Name is required.';
  }

  if (Validator.isEmpty(data.category|| '')) {
    errors.category = 'Category is required.';
  }

  if (Validator.isEmpty(data.costs || '')) {
    errors.costs = 'Costs is required.';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
