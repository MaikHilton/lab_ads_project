const { body } = require('express-validator');

exports.adValidationRules = () => {
  return [
    body('title')
      .trim()
      .notEmpty().withMessage('Заголовок обов\'язковий')
      .isLength({ min: 3, max: 100 }).withMessage('Заголовок має бути від 3 до 100 символів'),
    body('description')
      .trim()
      .notEmpty().withMessage('Опис обов\'язковий')
      .isLength({ min: 10 }).withMessage('Опис має містити мінімум 10 символів'),
    body('price')
      .isNumeric().withMessage('Ціна має бути числом')
      .isFloat({ min: 0 }).withMessage('Ціна не може бути від\'ємною'),
    body('location')
      .trim()
      .notEmpty().withMessage('Локація обов\'язкова'),
    body('category')
      .isIn(['electronics', 'clothing', 'furniture', 'transport', 'real-estate', 'other'])
      .withMessage('Недопустима категорія')
  ];
};