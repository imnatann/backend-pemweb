import { Router } from 'express';
import { getPenjualan, getPenjualanById, createPenjualan, updatePenjualan, deletePenjualan } from '../controllers/penjualanController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticateToken, getPenjualan);
router.get('/:idpenjualan', authenticateToken, getPenjualanById);
router.post('/', authenticateToken, createPenjualan);
router.put('/:idpenjualan', authenticateToken, updatePenjualan);
router.delete('/:idpenjualan', authenticateToken, deletePenjualan);

export default router;
