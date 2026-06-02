const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('./asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  
  // Спочатку пошук токену у cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } 
  // Якщо немає в cookies , пошук в заголовку
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Доступ заборонено. Токен відсутній', 401));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Термін дії токена вийшов. Увійдіть знову', 401));
    }
    return next(new AppError('Невірний токен. Увійдіть знову', 401));
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError('Користувача, якому належить токен, більше не існує', 401));
  }

  req.user = user;
  next();
});

module.exports = protect;