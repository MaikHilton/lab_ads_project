const Ad = require('../models/Ad');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middlewares/asyncHandler');

exports.getAllAds = asyncHandler(async (req, res, next) => {
  const ads = await Ad.find().populate('createdBy', 'name email');
  res.status(200).json({ success: true, count: ads.length, data: ads });
});

exports.getAd = asyncHandler(async (req, res, next) => {
  const ad = await Ad.findById(req.params.id).populate('createdBy', 'name email');
  if (!ad) return next(new AppError('Оголошення не знайдено', 404));
  res.status(200).json({ success: true, data: ad });
});

exports.createAd = asyncHandler(async (req, res, next) => {
  const ad = await Ad.create({
    ...req.body,
    createdBy: req.user._id
  });
  res.status(201).json({ success: true, data: ad });
});

exports.updateAd = asyncHandler(async (req, res, next) => {
  const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!ad) return next(new AppError('Оголошення не знайдено', 404));
  res.status(200).json({ success: true, data: ad });
});

exports.deleteAd = asyncHandler(async (req, res, next) => {
  const ad = await Ad.findByIdAndDelete(req.params.id);
  if (!ad) return next(new AppError('Оголошення не знайдено', 404));
  res.status(200).json({ success: true, message: 'Оголошення видалено' });
});