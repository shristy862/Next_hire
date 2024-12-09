import express from 'express';
import { verifyToken } from '../../middlewares/authToken.js';
import { checkRole } from '../../middlewares/checkRoles.js';
import { jobseekerDashboard } from '../controllers/dashboard.js';

const router = express.Router();

// Jobseeker-specific route
router.get('/auth/jobseeker/dashboard', verifyToken, checkRole(['jobseeker']), jobseekerDashboard);

export default router;
