require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./src/config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:19000', 'http://localhost:19001', 'http://localhost:8081'];
app.use(cors({ origin: allowedOrigins }));
app.use(morgan('dev'));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check route
app.get('/', (req, res) => {
  res.json({
    message: 'LifeQuest API Server',
    version: '1.0.0',
    status: 'running',
  });
});

// API Routes
console.log('📌 Loading routes...');
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/quests', require('./src/routes/quests'));
app.use('/api/questlog', require('./src/routes/questLog'));
app.use('/api/categories', require('./src/routes/categories'));
app.use('/api/stats', require('./src/routes/stats'));
app.use('/api/skilltree', require('./src/routes/skillTree'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});
