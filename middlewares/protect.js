const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('./asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Доступ заборонено. Токен відсутній', 401));
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return next(new AppError('Користувача, якому належить токен, більше не існує', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new AppError('Недійсний токен', 401));
  }
});

module.exports = protect;