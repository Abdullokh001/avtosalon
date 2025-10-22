import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import mashinaRoutes from './routes/mashinaRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import logger from './utils/logger.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Exam 5th Month API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      categories: '/api/categories',
      mashinas: '/api/mashinas',
      profile: '/api/profile'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/mashinas', mashinaRoutes);
app.use('/api/profile', profileRoutes);

// 404 handler
app.use((req, res) => {
  logger.warn('Route topilmadi', { path: req.path, method: req.method });
  res.status(404).json({
    success: false,
    message: 'Route topilmadi'
  });
});

// Error handler
app.use(errorHandler);

export default app;
