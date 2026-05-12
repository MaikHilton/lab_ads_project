const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Невірний ObjectId в Mongoose (наприклад, неіснуючий id оголошення)
  if (err.name === 'CastError') {
    const message = `Ресурс не знайдено. Невірний формат ID: ${err.value}`;
    error = new AppError(message, 404);
  }

  // Дублювання унікального поля (наприклад, реєстрація на існуючий email)
  if (err.code === 11000) {
    const message = 'Дублювання значення поля. Введіть інше значення';
    error = new AppError(message, 400);
  }

  // Помилка валідації Mongoose
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new AppError(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Внутрішня помилка сервера',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;