const express = require('express');
const router = express.Router();
const { sendSOSMessage } = require('../services/sosService');
require('dotenv').config();
const apiKey = process.env.API_KEY;

// POST route to send an SOS message
router.post('/send-sos', async (req, res) => {
  const { recipientPhoneNumber, messageBody, latitude, longitude } = req.body;

  // Validate request payload
  if (!recipientPhoneNumber || !messageBody || !latitude || !longitude) {
    return res.status(400).json({ error: 'Missing required parameters.' });
  }

  try {
    // Call the service function
    await sendSOSMessage(recipientPhoneNumber, messageBody, latitude, longitude, apiKey);
    res.status(200).json({ message: 'SOS message sent successfully!' });
  } catch (error) {
    console.error('Error in /send-sos:', error);
    res.status(500).json({ error: 'Failed to send SOS message.' });
  }
});

module.exports = router;