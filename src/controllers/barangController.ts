// src/controllers/barangController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /barang - Ambil semua barang
export const getBarang = async (req: Request, res: Response): Promise<void> => {
    try {
      const barang = await prisma.barang.findMany({
        include: {
          detailpembelian: true,
          detailpenjualan: true,
        },
      });
      console.log(barang);
      res.json(barang);
    } catch (error) {
      console.error('Error saat mengambil data barang:', error);
      if (error instanceof Error) {
        res.status(500).json({ error: 'Gagal mengambil data barang.', detail: error.message });
      } else {
        res.status(500).json({ error: 'Gagal mengambil data barang.', detail: 'Unknown error' });
      }
    }
  };  

// GET /barang/:idbarang - Ambil barang tertentu
export const getBarangById = async (req: Request, res: Response): Promise<void> => {
  const { idbarang } = req.params;
  try {
    const barang = await prisma.barang.findUnique({
      where: { idbarang: parseInt(idbarang) },
      include: {
        detailpembelian: true,
        detailpenjualan: true,
      },
    });
    if (barang) {
      res.json(barang);
    } else {
      res.status(404).json({ error: 'Barang tidak ditemukan.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data barang.' });
  }
};

// POST /barang - Tambah barang baru
export const createBarang = async (req: Request, res: Response): Promise<void> => {
  const { namabarang, kategori, hargabeli, hargajual, stok } = req.body;
  try {
    const newBarang = await prisma.barang.create({
      data: {
        namabarang,
        kategori,
        hargabeli: hargabeli ? parseFloat(hargabeli) : undefined,
        hargajual: hargajual ? parseFloat(hargajual) : undefined,
        stok: stok || 0,
      },
    });
    res.status(201).json(newBarang);
  } catch (error) {
    res.status(500).json({ error: 'Gagal menambahkan barang.' });
  }
};

// PUT /barang/:idbarang - Perbarui barang
export const updateBarang = async (req: Request, res: Response): Promise<void> => {
  const { idbarang } = req.params;
  const { namabarang, kategori, hargabeli, hargajual, stok } = req.body;
  try {
    const updatedBarang = await prisma.barang.update({
      where: { idbarang: parseInt(idbarang) },
      data: {
        namabarang,
        kategori,
        hargabeli: hargabeli ? parseFloat(hargabeli) : undefined,
        hargajual: hargajual ? parseFloat(hargajual) : undefined,
        stok: stok !== undefined ? stok : undefined,
      },
    });
    res.json(updatedBarang);
  } catch (error) {
    res.status(500).json({ error: 'Gagal memperbarui barang.' });
  }
};

// DELETE /barang/:idbarang - Hapus barang
export const deleteBarang = async (req: Request, res: Response): Promise<void> => {
  const { idbarang } = req.params;
  try {
    await prisma.barang.delete({
      where: { idbarang: parseInt(idbarang) },
    });
    res.json({ message: 'Barang berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus barang.' });
  }
};
// GET /barang/count - Hitung jumlah barang
export const countBarang = async (req: Request, res: Response): Promise<void> => {
    try {
      const totalBarang = await prisma.barang.count(); // Prisma's count method akan menghitung jumlah total baris di tabel Barang
      res.json({ total: totalBarang }); // Response dalam format JSON, hanya menampilkan jumlah barang
    } catch (error) {
      console.error('Error saat menghitung jumlah barang:', error); // Debugging jika error
      res.status(500).json({ error: 'Gagal menghitung jumlah barang.' }); // Pesan error jika terjadi kesalahan
    }
  };
  