import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';

import apiRoutes from './routes/index.js';
import { handleStripeWebhook } from './controllers/order.controller.js';
import { errorHandler, notFound } from './middlewares/error.middleware.js';

const app = express();

// 1. Security HTTP Headers
app.use(helmet());

// 2. CORS configuration (Supporting frontend cookies & credentials)
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow during development
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'stripe-signature']
  })
);

// 3. Request Logging in Development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 4. Rate Limiter for general endpoints
const limiter = rateLimit({
  max: 300,
  windowMs: 15 * 60 * 1000,
  message: {
    status: 'fail',
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});
app.use('/api', limiter);

// 5. STRIPE WEBHOOK ROUTE (Raw Buffer is required before express.json)
app.post(
  '/api/orders/webhook',
  express.raw({ type: 'application/json' }),
  handleStripeWebhook
);

// 6. Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 7. Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// 8. Mount all Application API Routes
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    name: 'IHF Luxury Custom Draperies REST API Engine (ES Modules)',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

// 9. Handle Unhandled Routes & Global Errors
app.use(notFound);
app.use(errorHandler);

export default app;
