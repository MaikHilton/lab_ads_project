const Ad = require('../models/Ad');
const AppError = require('../utils/AppError');

exports.getAllAds = async () => {
  return await Ad.find().populate('createdBy', 'name email');
};

exports.getAdById = async (id) => {
  const ad = await Ad.findById(id).populate('createdBy', 'name');
  if (!ad) throw new AppError('Оголошення не знайдено', 404);
  return ad;
};

exports.createAd = async (data, userId) => {
  return await Ad.create({ ...data, createdBy: userId });
};

exports.updateAd = async (id, data, currentUser) => {
  const ad = await Ad.findById(id);
  if (!ad) throw new AppError('Оголошення не знайдено', 404);

  // обмеження доступу: редагувати може тільки автор або адмін
  if (
    ad.createdBy.toString() !== currentUser._id.toString() &&
    currentUser.role !== 'admin'
  ) {
    throw new AppError('Ви не маєте прав редагувати це оголошення', 403);
  }

  Object.assign(ad, data);
  await ad.save(); 
  return ad;
};

exports.deleteAd = async (id) => {
  const ad = await Ad.findByIdAndDelete(id);
  if (!ad) throw new AppError('Оголошення не знайдено', 404);
  return ad;
};