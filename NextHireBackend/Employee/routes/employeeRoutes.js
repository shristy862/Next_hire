import express from 'express';
import { employeeDashboard } from '../controllers/dashboard.js';
import { verifyToken } from '../../middlewares/authToken.js';
import { checkRole } from '../../middlewares/checkRoles.js';

const router = express.Router();

router.get(
  '/dashboard',
  verifyToken,
  checkRole(['employee']),
  employeeDashboard
);

export default router;
