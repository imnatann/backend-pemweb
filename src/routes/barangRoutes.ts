// src/routes/barangRoutes.ts
import { Router } from 'express';
import { getBarang, getBarangById, createBarang, updateBarang, deleteBarang,countBarang } from '../controllers/barangController';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware';

const router = Router();

// Semua pengguna terautentikasi dapat melihat barang
router.get('/count', authenticateToken, authorizeRoles(['ADMIN', 'SUPERVISOR', 'KASIR']), countBarang);
router.get('/', authenticateToken, authorizeRoles(['ADMIN', 'SUPERVISOR', 'KASIR']), getBarang);
router.get('/:idbarang', authenticateToken, authorizeRoles(['ADMIN', 'SUPERVISOR', 'KASIR']), getBarangById);

// Hanya ADMIN dan SUPERVISOR yang dapat menambah dan memperbarui barang
router.post('/', authenticateToken, authorizeRoles(['ADMIN', 'SUPERVISOR']), createBarang);
router.put('/:idbarang', authenticateToken, authorizeRoles(['ADMIN', 'SUPERVISOR']), updateBarang);

// Hanya ADMIN yang dapat menghapus barang
router.delete('/:idbarang', authenticateToken, authorizeRoles(['ADMIN']), deleteBarang);
// GET /barang/count - Hitung jumlah barang


export default router;
