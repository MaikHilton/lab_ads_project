require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const mongoSanitizeCustom = require('./middlewares/sanitize');

// Безпека та Логування (Лаби 6, 7, 8)
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const adRoutes = require('./routes/adRoutes');
const AppError = require('./utils/AppError');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Статичні файли (для зображень та інших ресурсів)
app.use(express.static('public'));

// Логування (тільки для розробки)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Безпека: HTTP заголовки
app.use(helmet());

// Безпека: Обмеження кількості запитів (Rate Limiting)
const limiter = rateLimit({
  max: 100, 
  windowMs: 60 * 60 * 1000, // 1 година
  message: 'Забагато запитів з вашої IP адреси, спробуйте пізніше'
});
app.use('/api', limiter);

// Парсинг JSON
app.use(express.json());

// Безпека: Очищення даних від NoSQL ін'єкцій
app.use(mongoSanitizeCustom);

// Маршрути
app.use('/api/auth', authRoutes);
app.use('/api/ads', adRoutes);

// 404 handler (неіснуючі маршрути)
app.use((req, res, next) => {
  next(new AppError(`Маршрут ${req.originalUrl} не знайдено`, 404));
});

// Глобальний обробник помилок
app.use(errorHandler);

// Підключення до БД та запуск сервера
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch(err => console.error(err));