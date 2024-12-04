import { Router } from 'express';
import { getSuppliers, getSupplierById, createSupplier, updateSupplier, deleteSupplier } from '../controllers/supplierController';

const router = Router();

router.get('/', getSuppliers);
router.get('/:idsupplier', getSupplierById);
router.post('/', createSupplier);
router.put('/:idsupplier', updateSupplier);
router.delete('/:idsupplier', deleteSupplier);

export default router;
