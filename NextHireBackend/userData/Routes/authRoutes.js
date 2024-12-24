import express from 'express';
import { signup } from '../controllers/signupUsers.js';
import { verify } from '../controllers/verifyUsers.js';
import { login } from '../controllers/loginUsers.js';
import { resendOtp } from '../controllers/resendOtp.js'; 
const router = express.Router();

// Signup route
router.post('/signup', signup);
// Login route
router.post('/login', login);
// Verify route
router.post('/verify', verify);
// Resend OTP route
router.post('/resend-otp', resendOtp);

export default router;
