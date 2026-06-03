const Joi = require('joi');

exports.adSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    'string.min': 'Заголовок має бути від 3 символів',
    'any.required': 'Заголовок обов\'язковий'
  }),
  description: Joi.string().min(10).required().messages({
    'string.min': 'Опис має містити мінімум 10 символів',
    'any.required': 'Опис обов\'язковий'
  }),
  price: Joi.number().min(0).required().messages({
    'number.min': 'Ціна не може бути від\'ємною',
    'number.base': 'Ціна має бути числом',
    'any.required': 'Ціна обов\'язкова'
  }),
  location: Joi.string().required().messages({
    'any.required': 'Локація обов\'язкова'
  }),
  category: Joi.string().valid('electronics', 'clothing', 'furniture', 'transport', 'real-estate', 'other').required().messages({
    'any.only': 'Недопустима категорія',
    'any.required': 'Категорія обов\'язкова'
  })
});