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
        detailpembelian: {
          include: {
            barang: true,
          },
        },
      },
      orderBy: {
        tanggal: 'desc',
      },
    });

    // Hitung total untuk setiap pembelian
    const pembelianWithTotal = pembelian.map(p => {
      const total = p.detailpembelian.reduce((sum, detail) => {
        const hargabeli = typeof detail.hargabeli === 'number' 
          ? detail.hargabeli 
          : parseFloat(detail.hargabeli.toString());
        return sum + (detail.qty * hargabeli);
      }, 0);

      return {
        ...p,
        total,
      };
    });

    res.json(pembelianWithTotal);
  } catch (error) {
    console.error('Error getting pembelian:', error);
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
        detailpembelian: {
          include: {
            barang: true,
          },
        },
      },
    });

    if (pembelian) {
      const total = pembelian.detailpembelian.reduce((sum, detail) => {
        const hargabeli = typeof detail.hargabeli === 'number' 
          ? detail.hargabeli 
          : parseFloat(detail.hargabeli.toString());
        return sum + (detail.qty * hargabeli);
      }, 0);

      res.json({
        ...pembelian,
        total,
      });
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
  
  try {
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
          detailpembelian: {
            include: {
              barang: true,
            },
          },
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

      const total = newPembelian.detailpembelian.reduce((sum, detail) => {
        const hargabeli = typeof detail.hargabeli === 'number' 
          ? detail.hargabeli 
          : parseFloat(detail.hargabeli.toString());
        return sum + (detail.qty * hargabeli);
      }, 0);

      return {
        ...newPembelian,
        total,
      };
    });

    res.status(201).json(transaction);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Gagal menambahkan pembelian.' });
  }
};

// PUT /pembelian/:idpembelian - Perbarui pembelian
export const updatePembelian = async (req: Request, res: Response) => {
  const { idpembelian } = req.params;
  const { tanggal, idsupplier, iduser } = req.body;
  try {
    const updatedPembelian = await prisma.pembelian.update({
      where: { idpembelian: parseInt(idpembelian) },
      data: {
        tanggal: tanggal ? new Date(tanggal) : undefined,
        idsupplier: idsupplier ? parseInt(idsupplier) : undefined,
        iduser: iduser ? parseInt(iduser) : undefined,
      },
      include: {
        supplier: true,
        user: true,
        detailpembelian: {
          include: {
            barang: true,
          },
        },
      },
    });

    const total = updatedPembelian.detailpembelian.reduce((sum, detail) => {
      const hargabeli = typeof detail.hargabeli === 'number' 
        ? detail.hargabeli 
        : parseFloat(detail.hargabeli.toString());
      return sum + (detail.qty * hargabeli);
    }, 0);

    res.json({
      ...updatedPembelian,
      total,
    });
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
