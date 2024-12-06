import express from 'express';
import { sendForgotPasswordOTP, resetPassword } from '../controller/forgotPassword.js';

const router = express.Router();

// Forgot password routes
router.post('/forgot-password', sendForgotPasswordOTP);
router.post('/reset-password', resetPassword);

export default router;
