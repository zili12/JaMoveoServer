const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000' || 'https://frontendja.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: 'Content-Type',
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/songs', require('./routes/songs'));
app.use('/api/rehearsals', require('./routes/rehearsals'));

// Enhanced error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.message.includes('web crawling error')) {
    const axios = require('axios');

    axios.get('https://www.tab4u.com')
      .then(response => console.log('Tab4U is accessible'))
      .catch(error => console.error('Error accessing Tab4U:', error.message));
      
    return res.status(503).json({ error: 'Error fetching song data from external source' });
  }
  
  res.status(500).json({ error: 'An unexpected error occurred', details: err.message });
});

module.exports = app;
