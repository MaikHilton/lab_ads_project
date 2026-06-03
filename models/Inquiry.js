const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'Повідомлення обов\'язкове'],
    trim: true,
    minlength: 10,
    maxlength: 500
  },
  ad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ad',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});

// Унікальний індекс: один користувач може надіслати лише 1 запит на 1 конкретне оголошення
inquirySchema.index({ ad: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Inquiry', inquirySchema);