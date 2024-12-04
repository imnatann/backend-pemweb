import { Router } from 'express';
import { getDetailPenjualan, getDetailPenjualanById, createDetailPenjualan, updateDetailPenjualan, deleteDetailPenjualan } from '../controllers/detailPenjualanController';

const router = Router();

router.get('/', getDetailPenjualan);
router.get('/:iddetailpenjualan', getDetailPenjualanById);
router.post('/', createDetailPenjualan);
router.put('/:iddetailpenjualan', updateDetailPenjualan);
router.delete('/:iddetailpenjualan', deleteDetailPenjualan);

export default router;
