const twilio = require('twilio');

// Load environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Initialize Twilio client
const client = twilio(accountSid, authToken);

// Function to send an SOS message
async function sendSOSMessage(recipientPhoneNumber, messageBody, latitude, longitude) {
  try {
    const message = `SOS Alert!\n\n${messageBody}\n\nLocation: https://www.google.com/maps?q=${latitude},${longitude}`;
    await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: recipientPhoneNumber,
    });
    console.log('Message sent successfully');
  } catch (error) {
    console.error('Error sending message:', error);
    throw new Error('Failed to send SOS message');
  }
}

module.exports = { sendSOSMessage };