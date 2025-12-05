const { check } = require('express-validator');

exports.registerValidator = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  check('name', 'Name should be at least 2 characters').optional().isLength({ min: 2 })
];

exports.loginValidator = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
];

exports.createListingValidator = [
  check('title', 'Title is required and should be between 3 and 120 characters').isLength({ min: 3, max: 120 }),
  check('description', 'Description should be max 2000 characters').optional().isLength({ max: 2000 }),
  check('startingPrice', 'startingPrice must be a positive number').optional().isFloat({ gt: 0 }),
  check('category', 'Category should be a non-empty string').optional().isString()
];

exports.bidValidator = [
  check('amount', 'Bid amount must be a positive number').isFloat({ gt: 0 })
];

exports.chatValidator = [
  check('text', 'Message text is required and must be non-empty').isLength({ min: 1 })
];
