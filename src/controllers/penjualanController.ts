import { Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface DetailPenjualan {
  qty: number;
  hargajual: number | string | Prisma.Decimal;
}

interface PenjualanWithDetails {
  detailpenjualan: DetailPenjualan[];
}

interface AuthRequest extends Request {
  user?: any;
}
// GET /penjualan - Ambil semua penjualan
export const getPenjualan = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    const where: any = {};
    
    if (startDate && endDate) {
      where.tanggal = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    const penjualan = await prisma.penjualan.findMany({
      where,
      include: {
        customer: true,
        user: true,
        detailpenjualan: {
          include: {
            barang: true,
          },
        },
      },
      orderBy: {
        tanggal: 'desc',
      },
    });

    // Hitung total untuk setiap penjualan
    const penjualanWithTotal = penjualan.map(p => {
      const total = p.detailpenjualan.reduce((sum, detail) => {
        const hargajual = typeof detail.hargajual === 'number' 
          ? detail.hargajual 
          : parseFloat(detail.hargajual.toString());
        return sum + (detail.qty * hargajual);
      }, 0);

      return {
        ...p,
        total,
      };
    });

    res.json(penjualanWithTotal);
  } catch (error) {
    console.error('Error getting penjualan:', error);
    res.status(500).json({ error: 'Gagal mengambil data penjualan.' });
  }
};

// Versi dengan pagination
export const getPenjualanWithPagination = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, page = '1', limit = '10' } = req.query;
    
    const where: any = {};
    if (startDate && endDate) {
      where.tanggal = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [penjualan, total] = await prisma.$transaction([
      prisma.penjualan.findMany({
        where,
        include: {
          customer: true,
          user: true,
          detailpenjualan: {
            include: {
              barang: true,
            },
          },
        },
        orderBy: {
          tanggal: 'desc',
        },
        skip,
        take: parseInt(limit as string),
      }),
      prisma.penjualan.count({ where }),
    ]);

    const penjualanWithTotal = penjualan.map(p => {
      const total = p.detailpenjualan.reduce((sum, detail) => {
        const hargajual = typeof detail.hargajual === 'number' 
          ? detail.hargajual 
          : parseFloat(detail.hargajual.toString());
        return sum + (detail.qty * hargajual);
      }, 0);

      return {
        ...p,
        total,
      };
    });

    res.json({
      data: penjualanWithTotal,
      total,
      totalPages: Math.ceil(total / parseInt(limit as string)),
    });
  } catch (error) {
    console.error('Error getting penjualan:', error);
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
        detailpenjualan: {
          include: {
            barang: true,
          },
        },
      },
    });

    if (penjualan) {
      const total = penjualan.detailpenjualan.reduce((sum, detail) => {
        const hargajual = typeof detail.hargajual === 'number' 
          ? detail.hargajual 
          : parseFloat(detail.hargajual.toString());
        return sum + (detail.qty * hargajual);
      }, 0);

      res.json({
        ...penjualan,
        total,
      });
    } else {
      res.status(404).json({ error: 'Penjualan tidak ditemukan.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data penjualan.' });
  }
};


// POST /penjualan - Tambah penjualan baru dan update stok
export const createPenjualan = async (req: AuthRequest, res: Response) => {
  const { tanggal, idcustomer, detailpenjualan } = req.body;
  const userId = req.user?.userId; // Ambil userId dari token
  
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

      // Buat penjualan dengan userId dari token
      const newPenjualan = await prisma.penjualan.create({
        data: {
          tanggal: new Date(tanggal),
          idcustomer: idcustomer ? parseInt(idcustomer) : undefined,
          iduser: userId, // Gunakan userId dari token
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
