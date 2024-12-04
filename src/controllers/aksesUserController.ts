import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /akses-users - Ambil semua akses user
export const getAksesUsers = async (req: Request, res: Response) => {
  try {
    const aksesUsers = await prisma.aksesUser.findMany({
      include: { user: true },
    });
    res.json(aksesUsers);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data akses user.' });
  }
};

// GET /akses-users/:idakses - Ambil akses user tertentu
export const getAksesUserById = async (req: Request, res: Response) => {
  const { idakses } = req.params;
  try {
    const aksesUser = await prisma.aksesUser.findUnique({
      where: { idakses: parseInt(idakses) },
      include: { user: true },
    });
    if (aksesUser) {
      res.json(aksesUser);
    } else {
      res.status(404).json({ error: 'Akses User tidak ditemukan.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data akses user.' });
  }
};

// POST /akses-users - Tambah akses user baru
export const createAksesUser = async (req: Request, res: Response) => {
  const { iduser, role } = req.body;
  try {
    const newAksesUser = await prisma.aksesUser.create({
      data: {
        iduser: iduser ? parseInt(iduser) : undefined,
        role,
      },
    });
    res.status(201).json(newAksesUser);
  } catch (error) {
    res.status(500).json({ error: 'Gagal menambahkan akses user.' });
  }
};

// PUT /akses-users/:idakses - Perbarui akses user
export const updateAksesUser = async (req: Request, res: Response) => {
  const { idakses } = req.params;
  const { iduser, role } = req.body;
  try {
    const updatedAksesUser = await prisma.aksesUser.update({
      where: { idakses: parseInt(idakses) },
      data: {
        iduser: iduser ? parseInt(iduser) : undefined,
        role,
      },
    });
    res.json(updatedAksesUser);
  } catch (error) {
    res.status(500).json({ error: 'Gagal memperbarui akses user.' });
  }
};

// DELETE /akses-users/:idakses - Hapus akses user
export const deleteAksesUser = async (req: Request, res: Response) => {
  const { idakses } = req.params;
  try {
    await prisma.aksesUser.delete({
      where: { idakses: parseInt(idakses) },
    });
    res.json({ message: 'Akses User berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus akses user.' });
  }
};
