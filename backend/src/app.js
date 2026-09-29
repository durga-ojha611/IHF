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
import { xssSanitizer } from './middlewares/security.middleware.js';

const app = express();

// 1. Security HTTP Headers (Strict CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://js.stripe.com'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
        connectSrc: ["'self'", 'https://api.stripe.com'],
        frameSrc: ["'self'", 'https://js.stripe.com', 'https://hooks.stripe.com'],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null
      }
    },
    hsts: {
      maxAge: 31536000, // 1 year HSTS
      includeSubDomains: true,
      preload: true
    },
    frameguard: {
      action: 'deny' // Clickjacking protection (X-Frame-Options: DENY)
    },
    xContentTypeOptions: true, // X-Content-Type-Options: nosniff
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin'
    },
    crossOriginEmbedderPolicy: false
  })
);

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

// 7. Data Sanitization against NoSQL query injection & Cross-Site Scripting (XSS)
app.use(mongoSanitize());
app.use(xssSanitizer);

// 8. Mount all Application API Routes (Both /api/v1 and /api supported)
app.use('/api/v1', apiRoutes);
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
