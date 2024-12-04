import { Router } from 'express';
import { getDetailPembelian, getDetailPembelianById, createDetailPembelian, updateDetailPembelian, deleteDetailPembelian } from '../controllers/detailPembelianController';

const router = Router();

router.get('/', getDetailPembelian);
router.get('/:iddetailpembelian', getDetailPembelianById);
router.post('/', createDetailPembelian);
router.put('/:iddetailpembelian', updateDetailPembelian);
router.delete('/:iddetailpembelian', deleteDetailPembelian);

export default router;
