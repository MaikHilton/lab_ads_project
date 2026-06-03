const asyncHandler = require('../middlewares/asyncHandler');
const inquiryService = require('../services/inquiryService');

exports.getInquiries = asyncHandler(async (req, res) => {
  const inquiries = await inquiryService.getInquiriesByAd(req.params.adId);
  res.status(200).json({ success: true, count: inquiries.length, data: inquiries });
});

exports.createInquiry = asyncHandler(async (req, res) => {
  // adId береться з параметрів URL, userId — з токена (req.user)
  const inquiry = await inquiryService.createInquiry(req.body, req.params.adId, req.user._id);
  res.status(201).json({ success: true, data: inquiry });
});

exports.deleteInquiry = asyncHandler(async (req, res) => {
  await inquiryService.deleteInquiry(req.params.id, req.user);
  res.status(200).json({ success: true, message: 'Запит успішно видалено' });
});