const express = require('express');
// mergeParams: true дозволяє доступитися до :adId з батьківського роутера
const router = express.Router({ mergeParams: true }); 
const protect = require('../middlewares/protect');
const validate = require('../middlewares/validate');
const { createInquirySchema } = require('../validators/inquiryValidator');
const { getInquiries, createInquiry, deleteInquiry } = require('../controllers/inquiryController');

router.get('/', getInquiries); // Публічний перегляд запитів
router.post('/', protect, validate(createInquirySchema), createInquiry); // Авторизоване створення
router.delete('/:id', protect, deleteInquiry); // Видалення (автор або адмін)

module.exports = router;