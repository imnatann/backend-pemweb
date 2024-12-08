// src/routes/barangRoutes.ts
import { Router } from 'express';
import { 
  getBarang, 
  getBarangById, 
  createBarang, 
  updateBarang, 
  deleteBarang, 
  countBarang,
  getBarangBySupplier 
} from '../controllers/barangController';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/count', countBarang);

// Protected routes
router.get('/', authenticateToken, authorizeRoles(['ADMIN', 'SUPERVISOR', 'KASIR']), getBarang);
router.get('/:idbarang', authenticateToken, authorizeRoles(['ADMIN', 'SUPERVISOR', 'KASIR']), getBarangById);
router.get('/supplier/:idsupplier', authenticateToken, authorizeRoles(['ADMIN', 'SUPERVISOR', 'KASIR']), getBarangBySupplier);

// Admin and Supervisor only routes
router.post('/', authenticateToken, authorizeRoles(['ADMIN', 'SUPERVISOR']), createBarang);
router.put('/:idbarang', authenticateToken, authorizeRoles(['ADMIN', 'SUPERVISOR']), updateBarang);

// Admin only routes
router.delete('/:idbarang', authenticateToken, authorizeRoles(['ADMIN']), deleteBarang);

export default router;
