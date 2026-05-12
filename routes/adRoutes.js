const express = require('express');
const router = express.Router();
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');
const validate = require('../middlewares/validate');
const { adValidationRules } = require('../validators/adValidator');
const { getAllAds, getAd, createAd, updateAd, deleteAd } = require('../controllers/adController');

router.get('/', getAllAds);
router.get('/:id', getAd);

// Застосовуємо protect, потім валідацію, потім створення
router.post('/', protect, adValidationRules(), validate, createAd);
router.put('/:id', protect, updateAd);

router.delete('/:id', protect, restrictTo('admin'), deleteAd);

module.exports = router;