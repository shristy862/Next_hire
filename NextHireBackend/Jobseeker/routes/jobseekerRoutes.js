import express from 'express';
import { verifyToken } from '../../middlewares/authToken.js';
import { checkRole } from '../../middlewares/checkRoles.js';
import { jobseekerDashboard } from '../controllers/dashboard.js';
import { completeProfile } from '../controllers/completeProfile/addProfileDetails.js';
import { viewProfile } from '../controllers/completeProfile/viewProfileDetails.js';
const router = express.Router();

// Jobseeker-specific route
router.get('/auth/jobseeker/dashboard', verifyToken, checkRole(['jobseeker']), jobseekerDashboard);
// Complete profile route (protected)
router.post('/auth/jobseeker/complete-profile', verifyToken, completeProfile);
// View Profile (Authenticated User)
router.get('/auth/jobseeker/view-profile', verifyToken, viewProfile);
export default router;
