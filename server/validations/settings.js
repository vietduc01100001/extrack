const Validator = require('validator');
const { isEmpty } = require('../utils');

module.exports = (data) => {
  const errors = {};

  if (Validator.isEmpty(data.currentPassword || '')) {
    errors.username = 'Current password is required.';
  }

  if (Validator.isEmpty(data.newPassword || '')) {
    errors.password = 'New password is required.';
  }

  if (!Validator.isLength(data.newPassword, { min: 6 })) {
    errors.password = 'Password must be at least 6 characters.';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
