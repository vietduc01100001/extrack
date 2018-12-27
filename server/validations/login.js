const Validator = require('validator');
const { isEmpty } = require('../utils');

module.exports = (data) => {
  const errors = {};

  if (Validator.isEmpty(data.username || '')) {
    errors.username = 'Username is required.';
  }

  if (Validator.isEmpty(data.password || '')) {
    errors.password = 'Password is required.';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
