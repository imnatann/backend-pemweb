import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /pembelian - Ambil semua pembelian
export const getPembelian = async (req: Request, res: Response) => {
  try {
    const pembelian = await prisma.pembelian.findMany({
      include: {
        supplier: true,
        user: true,
        detailpembelian: true,
      },
    });
    res.json(pembelian);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data pembelian.' });
  }
};

// GET /pembelian/:idpembelian - Ambil pembelian tertentu
export const getPembelianById = async (req: Request, res: Response) => {
  const { idpembelian } = req.params;
  try {
    const pembelian = await prisma.pembelian.findUnique({
      where: { idpembelian: parseInt(idpembelian) },
      include: {
        supplier: true,
        user: true,
        detailpembelian: true,
      },
    });
    if (pembelian) {
      res.json(pembelian);
    } else {
      res.status(404).json({ error: 'Pembelian tidak ditemukan.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data pembelian.' });
  }
};

// POST /pembelian - Tambah pembelian baru dan update stok
export const createPembelian = async (req: Request, res: Response) => {
    const { tanggal, idsupplier, iduser, detailpembelian } = req.body;
    
    // Mulai transaksi Prisma
    const transaction = await prisma.$transaction(async (prisma) => {
      // Buat pembelian
      const newPembelian = await prisma.pembelian.create({
        data: {
          tanggal: new Date(tanggal),
          idsupplier: idsupplier ? parseInt(idsupplier) : undefined,
          iduser: iduser ? parseInt(iduser) : undefined,
          detailpembelian: {
            create: detailpembelian.map((detail: any) => ({
              idbarang: detail.idbarang ? parseInt(detail.idbarang) : undefined,
              qty: detail.qty,
              hargabeli: parseFloat(detail.hargabeli),
            })),
          },
        },
        include: {
          supplier: true,
          user: true,
          detailpembelian: true,
        },
      });
  
      // Update stok barang
      for (const detail of detailpembelian) {
        await prisma.barang.update({
          where: { idbarang: parseInt(detail.idbarang) },
          data: {
            stok: {
              increment: detail.qty,
            },
          },
        });
      }
  
      return newPembelian;
    });
  
    try {
      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ error: 'Gagal menambahkan pembelian.' });
    }
  };

// PUT /pembelian/:idpembelian - Perbarui pembelian
export const updatePembelian = async (req: Request, res: Response) => {
  const { idpembelian } = req.params;
  const { tanggal, idsupplier, iduser, detailpembelian } = req.body;
  try {
    const updatedPembelian = await prisma.pembelian.update({
      where: { idpembelian: parseInt(idpembelian) },
      data: {
        tanggal: tanggal ? new Date(tanggal) : undefined,
        idsupplier: idsupplier ? parseInt(idsupplier) : undefined,
        iduser: iduser ? parseInt(iduser) : undefined,
        // Untuk detailpembelian, biasanya kita perlu handling terpisah (create/update/delete)
      },
      include: {
        supplier: true,
        user: true,
        detailpembelian: true,
      },
    });
    res.json(updatedPembelian);
  } catch (error) {
    res.status(500).json({ error: 'Gagal memperbarui pembelian.' });
  }
};

// DELETE /pembelian/:idpembelian - Hapus pembelian
export const deletePembelian = async (req: Request, res: Response) => {
  const { idpembelian } = req.params;
  try {
    await prisma.pembelian.delete({
      where: { idpembelian: parseInt(idpembelian) },
    });
    res.json({ message: 'Pembelian berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus pembelian.' });
  }
};
