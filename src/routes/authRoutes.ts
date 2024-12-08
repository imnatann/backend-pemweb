// src/routes/authRoutes.ts
import { Router } from 'express';
import { register, login, refreshToken, logout } from '../controllers/authController';
import { getCurrentUser } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';


const router = Router();
router.get('/me', authenticateToken, getCurrentUser); // Tambahkan authenticateToken
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

export default router;
