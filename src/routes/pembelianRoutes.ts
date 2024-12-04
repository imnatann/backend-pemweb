import { Router } from 'express';
import { getPembelian, getPembelianById, createPembelian, updatePembelian, deletePembelian } from '../controllers/pembelianController';

const router = Router();

router.get('/', getPembelian);
router.get('/:idpembelian', getPembelianById);
router.post('/', createPembelian);
router.put('/:idpembelian', updatePembelian);
router.delete('/:idpembelian', deletePembelian);

export default router;
