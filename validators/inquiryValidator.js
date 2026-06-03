const Joi = require('joi');

exports.createInquirySchema = Joi.object({
  message: Joi.string().min(10).max(500).required().messages({
    'string.min': 'Повідомлення має містити мінімум 10 символів',
    'any.required': 'Текст повідомлення обов\'язковий'
  })
});