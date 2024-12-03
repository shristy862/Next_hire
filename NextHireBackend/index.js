require('dotenv').config();
const express = require('express');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');

// Initialize express app
const app = express();
const port = 3000;

// to parse JSON requests
app.use(bodyParser.json());

//  AWS SNS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const sns = new AWS.SNS();

//function to generate a random OTP
const generateOTP = () => {
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10); 
  }
  return otp;
};
app.get('/', (req,res)=> {
    res.send('Hello ! This is SNS Demo API');
})
// User signup route
app.post('/signup', async (req, res) => {
  const { phoneNumber } = req.body; 

  // Validate phone number format (Assume +91 for India, can be modified)
  if (!phoneNumber || !/^\+91\d{10}$/.test(phoneNumber)) {
    return res.status(400).json({ message: 'Invalid phone number format. Please use the format +91XXXXXXXXXX.' });
  }

  // Generate OTP
  const otp = generateOTP();

  // Send OTP via SMS using AWS SNS
  const params = {
    Message: `Your OTP code is: ${otp}`,
    PhoneNumber: phoneNumber, 
  };

  try {
    const data = await sns.publish(params).promise();
    console.log("SMS sent successfully:", data);
    res.status(200).json({ message: 'OTP sent successfully!', otp }); 
  } catch (error) {
    console.error("Error sending SMS:", error);
    res.status(500).json({ message: 'Failed to send OTP. Please try again later.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
