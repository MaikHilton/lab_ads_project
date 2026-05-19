const bcrypt = require('bcryptjs');
const User = require('../models/User');
const AppError = require('../utils/AppError');

exports.registerUser = async ({ name, email, password, confirmPassword }) => {
  if (password !== confirmPassword) {
    throw new AppError('Паролі не збігаються', 400);
  }

  const existing = await User.findOne({ email });
  if (existing) throw new AppError('Користувач із таким email вже існує', 409);

  // Пароль захешується автоматично через pre-save hook у моделі User
  return await User.create({ name, email, password });
};

exports.loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new AppError('Невірний email або пароль', 401);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError('Невірний email або пароль', 401);

  return user;
};
