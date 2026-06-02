const jwt = require('jsonwebtoken');
const asyncHandler = require('../middlewares/asyncHandler');
const authService = require('../services/authService');

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

// Налаштування для httpOnly cookie
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000
};

exports.register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);
  const token = generateToken(user._id, user.role);

  res.cookie('token', token, cookieOptions);

  res.status(201).json({
    success: true,
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
});

exports.login = asyncHandler(async (req, res) => {
  const user = await authService.loginUser(req.body);
  const token = generateToken(user._id, user.role);

  res.cookie('token', token, cookieOptions);
  res.status(200).json({
    success: true,
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
});

// Логіка виходу з системи
exports.logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'loggedout', { ...cookieOptions, maxAge: 10 * 1000 });
  res.status(200).json({ success: true, message: 'Вихід виконано' });
});

exports.getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});