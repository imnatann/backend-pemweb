import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

interface DetailPembelianWithTotal {
  sum: number;
  detail: {
    qty: number;
    hargabeli: number | string;
  };
}

// GET /detailpembelian - Ambil semua detail pembelian
export const getDetailPembelian = async (req: Request, res: Response) => {
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
    });

    // Calculate total for each pembelian
    const pembelianWithTotal = pembelian.map(p => ({
      ...p,
      total: p.detailpembelian.reduce((sum: number, detail: any) => 
        sum + (detail.qty * parseFloat(detail.hargabeli.toString())), 0
      ),
    }));

    res.json(pembelianWithTotal);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data pembelian.' });
  }
};

// GET /detailpembelian/:idpembelian - Ambil detail pembelian tertentu
export const getDetailPembelianById = async (req: Request, res: Response) => {
  const { idpembelian } = req.params;
  try {
    const pembelian = await prisma.pembelian.findUnique({
      where: { 
        idpembelian: parseInt(idpembelian) 
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

    if (pembelian) {
      const total = pembelian.detailpembelian.reduce((sum: number, detail: any) => 
        sum + (detail.qty * parseFloat(detail.hargabeli.toString())), 0
      );

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

// POST /detailpembelian - Tambah detail pembelian baru
export const createDetailPembelian = async (req: Request, res: Response) => {
  const { idpembelian, idbarang, qty, hargabeli } = req.body;
  try {
    const newDetailPembelian = await prisma.detailPembelian.create({
      data: {
        idpembelian: parseInt(idpembelian),
        idbarang: parseInt(idbarang),
        qty,
        hargabeli: parseFloat(hargabeli),
      },
    });

    const pembelian = await prisma.pembelian.findUnique({
      where: { 
        idpembelian: parseInt(idpembelian)
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

    if (pembelian) {
      const total = pembelian.detailpembelian.reduce((sum: number, detail: any) => 
        sum + (detail.qty * parseFloat(detail.hargabeli.toString())), 0
      );

      res.status(201).json({
        ...pembelian,
        total,
      });
    }
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
    });

    const pembelian = await prisma.pembelian.findUnique({
      where: { 
        idpembelian: updatedDetailPembelian.idpembelian ?? undefined
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

    if (pembelian) {
      const total = pembelian.detailpembelian.reduce((sum: number, detail: any) => 
        sum + (detail.qty * parseFloat(detail.hargabeli.toString())), 0
      );

      res.json({
        ...pembelian,
        total,
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Gagal memperbarui detail pembelian.' });
  }
};
// DELETE /detailpembelian/:iddetailpembelian - Hapus detail pembelian
export const deleteDetailPembelian = async (req: Request, res: Response) => {
  const { iddetailpembelian } = req.params;
  try {
    const deletedDetail = await prisma.detailPembelian.delete({
      where: { iddetailpembelian: parseInt(iddetailpembelian) },
    });

    const pembelian = await prisma.pembelian.findUnique({
      where: { 
        idpembelian: deletedDetail.idpembelian ?? undefined
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

    if (pembelian) {
      const total = pembelian.detailpembelian.reduce((sum: number, detail: any) => 
        sum + (detail.qty * parseFloat(detail.hargabeli.toString())), 0
      );

      res.json({
        ...pembelian,
        total,
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus detail pembelian.' });
  }
};