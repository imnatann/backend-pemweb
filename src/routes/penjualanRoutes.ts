import { Router } from 'express';
import { getPenjualan, getPenjualanById, createPenjualan, updatePenjualan, deletePenjualan } from '../controllers/penjualanController';

const router = Router();

router.get('/', getPenjualan);
router.get('/:idpenjualan', getPenjualanById);
router.post('/', createPenjualan);
router.put('/:idpenjualan', updatePenjualan);
router.delete('/:idpenjualan', deletePenjualan);

export default router;
