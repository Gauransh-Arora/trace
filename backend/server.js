const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const sosRoute = require('./routes/sosRoute');
app.use('/', sosRoute);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Backend server is running.');
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access from mobile: http://localhost:${PORT}`);
});
