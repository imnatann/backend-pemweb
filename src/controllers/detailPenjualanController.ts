import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /detailpenjualan - Ambil semua detail penjualan
export const getDetailPenjualan = async (req: Request, res: Response) => {
  try {
    const detailPenjualan = await prisma.detailPenjualan.findMany({
      include: {
        penjualan: true,
        barang: true,
      },
    });
    res.json(detailPenjualan);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data detail penjualan.' });
  }
};

// GET /detailpenjualan/:iddetailpenjualan - Ambil detail penjualan tertentu
export const getDetailPenjualanById = async (req: Request, res: Response) => {
  const { iddetailpenjualan } = req.params;
  try {
    const detailPenjualan = await prisma.detailPenjualan.findUnique({
      where: { iddetailpenjualan: parseInt(iddetailpenjualan) },
      include: {
        penjualan: true,
        barang: true,
      },
    });
    if (detailPenjualan) {
      res.json(detailPenjualan);
    } else {
      res.status(404).json({ error: 'Detail Penjualan tidak ditemukan.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data detail penjualan.' });
  }
};

// POST /detailpenjualan - Tambah detail penjualan baru
export const createDetailPenjualan = async (req: Request, res: Response) => {
  const { idpenjualan, idbarang, qty, hargajual } = req.body;
  try {
    const newDetailPenjualan = await prisma.detailPenjualan.create({
      data: {
        idpenjualan: idpenjualan ? parseInt(idpenjualan) : undefined,
        idbarang: idbarang ? parseInt(idbarang) : undefined,
        qty,
        hargajual: parseFloat(hargajual),
      },
      include: {
        penjualan: true,
        barang: true,
      },
    });
    res.status(201).json(newDetailPenjualan);
  } catch (error) {
    res.status(500).json({ error: 'Gagal menambahkan detail penjualan.' });
  }
};

// PUT /detailpenjualan/:iddetailpenjualan - Perbarui detail penjualan
export const updateDetailPenjualan = async (req: Request, res: Response) => {
  const { iddetailpenjualan } = req.params;
  const { idpenjualan, idbarang, qty, hargajual } = req.body;
  try {
    const updatedDetailPenjualan = await prisma.detailPenjualan.update({
      where: { iddetailpenjualan: parseInt(iddetailpenjualan) },
      data: {
        idpenjualan: idpenjualan ? parseInt(idpenjualan) : undefined,
        idbarang: idbarang ? parseInt(idbarang) : undefined,
        qty,
        hargajual: hargajual ? parseFloat(hargajual) : undefined,
      },
      include: {
        penjualan: true,
        barang: true,
      },
    });
    res.json(updatedDetailPenjualan);
  } catch (error) {
    res.status(500).json({ error: 'Gagal memperbarui detail penjualan.' });
  }
};

// DELETE /detailpenjualan/:iddetailpenjualan - Hapus detail penjualan
export const deleteDetailPenjualan = async (req: Request, res: Response) => {
  const { iddetailpenjualan } = req.params;
  try {
    await prisma.detailPenjualan.delete({
      where: { iddetailpenjualan: parseInt(iddetailpenjualan) },
    });
    res.json({ message: 'Detail Penjualan berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus detail penjualan.' });
  }
};
