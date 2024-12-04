import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /users - Ambil semua user
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        akses: true,
        penjualan: true,
        pembelian: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data user.' });
  }
};

// GET /users/:iduser - Ambil user tertentu
export const getUserById = async (req: Request, res: Response) => {
  const { iduser } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { iduser: parseInt(iduser) },
      include: {
        akses: true,
        penjualan: true,
        pembelian: true,
      },
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User tidak ditemukan.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data user.' });
  }
};

// POST /users - Tambah user baru
export const createUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        password,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Gagal menambahkan user.' });
  }
};

// PUT /users/:iduser - Perbarui user
export const updateUser = async (req: Request, res: Response) => {
  const { iduser } = req.params;
  const { username, password } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { iduser: parseInt(iduser) },
      data: {
        username,
        password,
      },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Gagal memperbarui user.' });
  }
};

// DELETE /users/:iduser - Hapus user
export const deleteUser = async (req: Request, res: Response) => {
  const { iduser } = req.params;
  try {
    await prisma.user.delete({
      where: { iduser: parseInt(iduser) },
    });
    res.json({ message: 'User berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus user.' });
  }
};
