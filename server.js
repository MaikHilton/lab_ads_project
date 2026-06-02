require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const mongoSanitizeCustom = require('./middlewares/sanitize');
const cors = require('cors'); // ДОДАНО
const cookieParser = require('cookie-parser'); // ДОДАНО

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const adRoutes = require('./routes/adRoutes');
const AppError = require('./utils/AppError');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// CORS — має бути ДО ВСІХ маршрутів
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5500',
  credentials: true
}));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "http://127.0.0.1:5500", "http://localhost:5500"],
        styleSrc: ["'self'", "'unsafe-inline'", "blob:"],
        connectSrc: ["'self'", "http://localhost:3000", "http://127.0.0.1:5500", "http://localhost:5500", "ws://127.0.0.1:5500", "ws://localhost:5500"],
      },
    },
  })
);

const limiter = rateLimit({
  max: 100, 
  windowMs: 60 * 60 * 1000,
  message: 'Забагато запитів з вашої IP адреси'
});
app.use('/api', limiter);

app.use(express.json());
app.use(cookieParser()); // ДОДАНО: парсер для читання cookies

app.use(mongoSanitizeCustom);

app.use('/api/auth', authRoutes);
app.use('/api/ads', adRoutes);

app.use((req, res, next) => {
  next(new AppError(`Маршрут ${req.originalUrl} не знайдено`, 404));
});

app.use(errorHandler);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch(err => console.error(err));