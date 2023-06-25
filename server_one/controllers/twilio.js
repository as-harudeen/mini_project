const twilio = require('twilio');

// Twilio API credentials
const accountSid = 'ACca537eda90f096c4a468b0af8dd2166c';
const authToken = 'c11229cf29d198f82a5504dc9f634819';

// Create a Twilio client
const client = twilio(accountSid, authToken);

// Compose the OTP message
// const otp = generateOTP(); // Implement your OTP generation logic
const message = `Your OTP is: ${5335}`;

// Send the SMS with Twilio
client.messages
  .create({
    body: message,
    from: '7994378178',
    to: '7510888178'
  })
  .then(message => console.log(`OTP message sent. SID: ${message.sid}`))
  .catch(error => console.error('Error sending OTP message:', error));

