import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /supplier - Ambil semua supplier
export const getSuppliers = async (req: Request, res: Response) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      include: { pembelian: true },
    });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data supplier.' });
  }
};

// GET /supplier/:idsupplier - Ambil supplier tertentu
export const getSupplierById = async (req: Request, res: Response) => {
  const { idsupplier } = req.params;
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { idsupplier: parseInt(idsupplier) },
      include: { pembelian: true },
    });
    if (supplier) {
      res.json(supplier);
    } else {
      res.status(404).json({ error: 'Supplier tidak ditemukan.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data supplier.' });
  }
};

// POST /supplier - Tambah supplier baru
export const createSupplier = async (req: Request, res: Response) => {
  const { namasupplier, alamat, telepon } = req.body;
  try {
    const newSupplier = await prisma.supplier.create({
      data: {
        namasupplier,
        alamat,
        telepon,
      },
    });
    res.status(201).json(newSupplier);
  } catch (error) {
    res.status(500).json({ error: 'Gagal menambahkan supplier.' });
  }
};

// PUT /supplier/:idsupplier - Perbarui supplier
export const updateSupplier = async (req: Request, res: Response) => {
  const { idsupplier } = req.params;
  const { namasupplier, alamat, telepon } = req.body;
  try {
    const updatedSupplier = await prisma.supplier.update({
      where: { idsupplier: parseInt(idsupplier) },
      data: {
        namasupplier,
        alamat,
        telepon,
      },
    });
    res.json(updatedSupplier);
  } catch (error) {
    res.status(500).json({ error: 'Gagal memperbarui supplier.' });
  }
};

// DELETE /supplier/:idsupplier - Hapus supplier
export const deleteSupplier = async (req: Request, res: Response) => {
  const { idsupplier } = req.params;
  try {
    await prisma.supplier.delete({
      where: { idsupplier: parseInt(idsupplier) },
    });
    res.json({ message: 'Supplier berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus supplier.' });
  }
};
