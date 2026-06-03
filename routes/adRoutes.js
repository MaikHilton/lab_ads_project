const express = require('express');
const router = express.Router();
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');
const validate = require('../middlewares/validate');
const { adSchema } = require('../validators/adValidator');
const { getAllAds, getAd, createAd, updateAd, deleteAd } = require('../controllers/adController');

const inquiryRouter = require('./inquiryRoutes');

// Вкладений маршрут для запитів до оголошень
router.use('/:adId/inquiries', inquiryRouter);

router.get('/', getAllAds);
router.get('/:id', getAd);
// joi валідація для створення та оновлення оголошення
router.post('/', protect, validate(adSchema), createAd);
router.put('/:id', protect, validate(adSchema), updateAd);
router.delete('/:id', protect, restrictTo('admin'), deleteAd);

module.exports = router;