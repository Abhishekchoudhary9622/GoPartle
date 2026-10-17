const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const eventRoutes = require('./routes/eventRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// Middleware
const isAllowedOrigin = (origin) => {
  // Allow requests with no origin (like mobile apps, curl, Postman, health checkers)
  if (!origin) return true;

  // Local development origins
  if (origin === 'http://localhost:3000' || origin === 'http://127.0.0.1:3000') {
    return true;
  }

  // Allow in non-production or if FRONTEND_URL is wildcard
  if (process.env.FRONTEND_URL === '*' || process.env.NODE_ENV !== 'production') {
    return true;
  }

  // Exact or normalized match with FRONTEND_URL
  if (process.env.FRONTEND_URL) {
    const cleanFrontendUrl = process.env.FRONTEND_URL.replace(/\/+$/, '');
    if (origin === cleanFrontendUrl) {
      return true;
    }
  }

  // Allow any Vercel domain (*.vercel.app) for preview & production deployments
  try {
    const url = new URL(origin);
    if (url.hostname.endsWith('.vercel.app')) {
      return true;
    }
  } catch {
    // Ignore invalid URL parsing
  }

  return false;
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy: Origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Root welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to GoPratle Event Requirement API',
    documentation: '/api/health or /api/events',
    version: '1.0.0',
  });
});

// API Routes
app.use('/api', eventRoutes);

// Catch-all 404 & Error Handler
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
