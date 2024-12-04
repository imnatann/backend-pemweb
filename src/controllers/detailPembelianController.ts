import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /detailpembelian - Ambil semua detail pembelian
export const getDetailPembelian = async (req: Request, res: Response) => {
  try {
    const detailPembelian = await prisma.detailPembelian.findMany({
      include: {
        pembelian: true,
        barang: true,
      },
    });
    res.json(detailPembelian);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data detail pembelian.' });
  }
};

// GET /detailpembelian/:iddetailpembelian - Ambil detail pembelian tertentu
export const getDetailPembelianById = async (req: Request, res: Response) => {
  const { iddetailpembelian } = req.params;
  try {
    const detailPembelian = await prisma.detailPembelian.findUnique({
      where: { iddetailpembelian: parseInt(iddetailpembelian) },
      include: {
        pembelian: true,
        barang: true,
      },
    });
    if (detailPembelian) {
      res.json(detailPembelian);
    } else {
      res.status(404).json({ error: 'Detail Pembelian tidak ditemukan.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data detail pembelian.' });
  }
};

// POST /detailpembelian - Tambah detail pembelian baru
export const createDetailPembelian = async (req: Request, res: Response) => {
  const { idpembelian, idbarang, qty, hargabeli } = req.body;
  try {
    const newDetailPembelian = await prisma.detailPembelian.create({
      data: {
        idpembelian: idpembelian ? parseInt(idpembelian) : undefined,
        idbarang: idbarang ? parseInt(idbarang) : undefined,
        qty,
        hargabeli: parseFloat(hargabeli),
      },
      include: {
        pembelian: true,
        barang: true,
      },
    });
    res.status(201).json(newDetailPembelian);
  } catch (error) {
    res.status(500).json({ error: 'Gagal menambahkan detail pembelian.' });
  }
};

// PUT /detailpembelian/:iddetailpembelian - Perbarui detail pembelian
export const updateDetailPembelian = async (req: Request, res: Response) => {
  const { iddetailpembelian } = req.params;
  const { idpembelian, idbarang, qty, hargabeli } = req.body;
  try {
    const updatedDetailPembelian = await prisma.detailPembelian.update({
      where: { iddetailpembelian: parseInt(iddetailpembelian) },
      data: {
        idpembelian: idpembelian ? parseInt(idpembelian) : undefined,
        idbarang: idbarang ? parseInt(idbarang) : undefined,
        qty,
        hargabeli: hargabeli ? parseFloat(hargabeli) : undefined,
      },
      include: {
        pembelian: true,
        barang: true,
      },
    });
    res.json(updatedDetailPembelian);
  } catch (error) {
    res.status(500).json({ error: 'Gagal memperbarui detail pembelian.' });
  }
};

// DELETE /detailpembelian/:iddetailpembelian - Hapus detail pembelian
export const deleteDetailPembelian = async (req: Request, res: Response) => {
  const { iddetailpembelian } = req.params;
  try {
    await prisma.detailPembelian.delete({
      where: { iddetailpembelian: parseInt(iddetailpembelian) },
    });
    res.json({ message: 'Detail Pembelian berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus detail pembelian.' });
  }
};
