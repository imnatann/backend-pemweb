import { Router } from 'express';
import { getAllStok, getLowStock, getStokById, updateStok } from '../controllers/stokController';
import { authenticateToken } from '../middleware/authMiddleware';


const router = Router();

// Ambil semua stok
router.get('/', getAllStok);
router.get('/low', getLowStock);

// Ambil stok berdasarkan ID barang
router.get('/:idbarang', getStokById);

// Update stok barang (opsional)
router.put('/:idbarang', updateStok);



export default router;
