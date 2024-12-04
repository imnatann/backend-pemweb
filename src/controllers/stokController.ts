import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /stok - Ambil semua stok barang
export const getAllStok = async (req: Request, res: Response) => {
  try {
    const stokBarang = await prisma.barang.findMany({
      select: {
        idbarang: true,
        namabarang: true,
        stok: true,
      },
      orderBy: { namabarang: 'asc' },
    });
    res.json(stokBarang);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data stok barang.' });
  }
};

// GET /stok/:idbarang - Ambil stok barang tertentu
export const getStokById = async (req: Request, res: Response) => {
  const { idbarang } = req.params;
  try {
    const barang = await prisma.barang.findUnique({
      where: { idbarang: parseInt(idbarang) },
      select: {
        idbarang: true,
        namabarang: true,
        stok: true,
      },
    });

    if (barang) {
      res.json(barang);
    } else {
      res.status(404).json({ error: 'Barang tidak ditemukan.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data stok barang.' });
  }
};

// PUT /stok/:idbarang - Update stok barang manual (opsional)
export const updateStok = async (req: Request, res: Response) => {
  const { idbarang } = req.params;
  const { stok } = req.body;

  try {
    const updatedBarang = await prisma.barang.update({
      where: { idbarang: parseInt(idbarang) },
      data: { stok: stok },
      select: {
        idbarang: true,
        namabarang: true,
        stok: true,
      },
    });
    res.json(updatedBarang);
  } catch (error) {
    res.status(500).json({ error: 'Gagal memperbarui stok barang.' });
  }
};

export const getLowStock = async (req: Request, res: Response): Promise<void> => {
  try {
    // Batas stok minimal (default 10)
    const minimalStok = parseInt(req.query.minimalStok as string) || 10;

    // Query barang dengan stok < minimal
    const lowStockItems = await prisma.barang.findMany({
      where: { stok: { lt: minimalStok } },
      select: {
        idbarang: true,
        namabarang: true,
        stok: true,
      },
      orderBy: { stok: 'asc' },
    });

    // Jika tidak ada barang dengan stok menipis
    if (lowStockItems.length === 0) {
      res.status(200).json({
        message: 'Semua stok barang aman.',
        minimalStok,
        data: [],
      });
      return;
    }

    // Transformasi data untuk menambahkan informasi "Minimal Stok" dan "Status"
    const response = lowStockItems.map((item) => ({
      idBarang: item.idbarang,
      namaProduk: item.namabarang,
      stokSaatIni: item.stok,
      minimalStok,
      status: 'Stok Rendah',
    }));

    res.status(200).json(response);
  } catch (error: unknown) {
    console.error('Error saat mengambil data stok barang menipis:', error);
    res.status(500).json({
      error: 'Gagal mengambil data stok barang menipis.',
      detail: error instanceof Error ? error.message : String(error),
    });
  }
};