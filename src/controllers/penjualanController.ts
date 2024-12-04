import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /penjualan - Ambil semua penjualan
export const getPenjualan = async (req: Request, res: Response) => {
  try {
    const penjualan = await prisma.penjualan.findMany({
      include: {
        customer: true,
        user: true,
        detailpenjualan: true,
      },
    });
    res.json(penjualan);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data penjualan.' });
  }
};

// GET /penjualan/:idpenjualan - Ambil penjualan tertentu
export const getPenjualanById = async (req: Request, res: Response) => {
  const { idpenjualan } = req.params;
  try {
    const penjualan = await prisma.penjualan.findUnique({
      where: { idpenjualan: parseInt(idpenjualan) },
      include: {
        customer: true,
        user: true,
        detailpenjualan: true,
      },
    });
    if (penjualan) {
      res.json(penjualan);
    } else {
      res.status(404).json({ error: 'Penjualan tidak ditemukan.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data penjualan.' });
  }
};

// POST /penjualan - Tambah penjualan baru dan update stok
export const createPenjualan = async (req: Request, res: Response) => {
    const { tanggal, idcustomer, iduser, detailpenjualan } = req.body;
    
    try {
      // Mulai transaksi Prisma
      const transaction = await prisma.$transaction(async (prisma) => {
        // Periksa stok sebelum penjualan
        for (const detail of detailpenjualan) {
          const barang = await prisma.barang.findUnique({
            where: { idbarang: parseInt(detail.idbarang) },
          });
  
          if (!barang) {
            throw new Error(`Barang dengan ID ${detail.idbarang} tidak ditemukan.`);
          }
  
          if (barang.stok < detail.qty) {
            throw new Error(`Stok barang "${barang.namabarang}" tidak mencukupi.`);
          }
        }
  
        // Buat penjualan
        const newPenjualan = await prisma.penjualan.create({
          data: {
            tanggal: new Date(tanggal),
            idcustomer: idcustomer ? parseInt(idcustomer) : undefined,
            iduser: iduser ? parseInt(iduser) : undefined,
            detailpenjualan: {
              create: detailpenjualan.map((detail: any) => ({
                idbarang: detail.idbarang ? parseInt(detail.idbarang) : undefined,
                qty: detail.qty,
                hargajual: parseFloat(detail.hargajual),
              })),
            },
          },
          include: {
            customer: true,
            user: true,
            detailpenjualan: true,
          },
        });
  
        // Update stok barang
        for (const detail of detailpenjualan) {
          await prisma.barang.update({
            where: { idbarang: parseInt(detail.idbarang) },
            data: {
              stok: {
                decrement: detail.qty,
              },
            },
          });
        }
  
        return newPenjualan;
      });
  
      res.status(201).json(transaction);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Gagal menambahkan penjualan.' });
    }
  };
// PUT /penjualan/:idpenjualan - Perbarui penjualan
export const updatePenjualan = async (req: Request, res: Response) => {
  const { idpenjualan } = req.params;
  const { tanggal, idcustomer, iduser, detailpenjualan } = req.body;
  try {
    const updatedPenjualan = await prisma.penjualan.update({
      where: { idpenjualan: parseInt(idpenjualan) },
      data: {
        tanggal: tanggal ? new Date(tanggal) : undefined,
        idcustomer: idcustomer ? parseInt(idcustomer) : undefined,
        iduser: iduser ? parseInt(iduser) : undefined,
        // Untuk detailpenjualan, handling terpisah diperlukan
      },
      include: {
        customer: true,
        user: true,
        detailpenjualan: true,
      },
    });
    res.json(updatedPenjualan);
  } catch (error) {
    res.status(500).json({ error: 'Gagal memperbarui penjualan.' });
  }
};

// DELETE /penjualan/:idpenjualan - Hapus penjualan
export const deletePenjualan = async (req: Request, res: Response) => {
  const { idpenjualan } = req.params;
  try {
    await prisma.penjualan.delete({
      where: { idpenjualan: parseInt(idpenjualan) },
    });
    res.json({ message: 'Penjualan berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus penjualan.' });
  }
};
