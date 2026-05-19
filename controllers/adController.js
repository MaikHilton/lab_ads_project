const asyncHandler = require('../middlewares/asyncHandler');
const adService = require('../services/adService');

exports.getAllAds = asyncHandler(async (req, res) => {
  const ads = await adService.getAllAds();
  res.status(200).json({ success: true, count: ads.length, data: ads });
});

exports.getAd = asyncHandler(async (req, res) => {
  const ad = await adService.getAdById(req.params.id);
  res.status(200).json({ success: true, data: ad });
});

exports.createAd = asyncHandler(async (req, res) => {
  const ad = await adService.createAd(req.body, req.user._id);
  res.status(201).json({ success: true, data: ad });
});

exports.updateAd = asyncHandler(async (req, res) => {
  const ad = await adService.updateAd(req.params.id, req.body, req.user);
  res.status(200).json({ success: true, data: ad });
});

exports.deleteAd = asyncHandler(async (req, res) => {
  await adService.deleteAd(req.params.id);
  res.status(200).json({ success: true, message: 'Оговорення видалено' });
});