import { Request, Response } from 'express';
import { EnumRole, PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


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
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, role } = req.body;

    // Validasi input
    if (!username || !password || !role) {
      res.status(400).json({
        status: 'error',
        code: 'VALIDATION_ERROR',
        message: 'Data tidak lengkap',
        details: {
          username: !username ? 'Username diperlukan' : null,
          password: !password ? 'Password diperlukan' : null,
          role: !role ? 'Role diperlukan' : null
        }
      });
      return;
    }

    // Validasi format username
    if (username.length < 3) {
      res.status(400).json({
        status: 'error',
        code: 'INVALID_USERNAME',
        message: 'Username minimal 3 karakter'
      });
      return;
    }

    // Validasi format password
    if (password.length < 6) {
      res.status(400).json({
        status: 'error',
        code: 'INVALID_PASSWORD',
        message: 'Password minimal 6 karakter'
      });
      return;
    }

    // Validasi role
    if (!Object.values(EnumRole).includes(role as EnumRole)) {
      res.status(400).json({
        status: 'error',
        code: 'INVALID_ROLE',
        message: 'Role tidak valid',
        validRoles: Object.values(EnumRole)
      });
      return;
    }

    // Cek username yang sudah ada
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      res.status(409).json({
        status: 'error',
        code: 'USERNAME_EXISTS',
        message: 'Username sudah digunakan'
      });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru menggunakan transaction
    const newUser = await prisma.$transaction(async (prisma) => {
      // Buat user
      const user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
        },
      });

      // Buat akses user
      const akses = await prisma.aksesUser.create({
        data: {
          iduser: user.iduser,
          role: role as EnumRole,
        },
      });

      return {
        ...user,
        akses: [akses],
      };
    });

    // Hapus password dari response
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: userWithoutPassword
    });

  } catch (error) {
    console.error('Create User Error:', error);
    res.status(500).json({
      status: 'error',
      code: 'CREATION_ERROR',
      message: 'Gagal menambahkan user',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// PUT /users/:iduser - Perbarui user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { iduser } = req.params;
    const { username, password, role } = req.body;

    // Validasi input
    if (!username) {
      res.status(400).json({
        status: 'error',
        code: 'VALIDATION_ERROR',
        message: 'Username diperlukan'
      });
      return;
    }

    // Validasi format username
    if (username.length < 3) {
      res.status(400).json({
        status: 'error',
        code: 'INVALID_USERNAME',
        message: 'Username minimal 3 karakter'
      });
      return;
    }

    // Cek apakah user exists
    const existingUser = await prisma.user.findUnique({
      where: { iduser: parseInt(iduser) },
      include: { akses: true }
    });

    if (!existingUser) {
      res.status(404).json({
        status: 'error',
        code: 'USER_NOT_FOUND',
        message: 'User tidak ditemukan'
      });
      return;
    }

    // Prepare update data
    let updateData: any = { username };

    // Jika password diubah, hash password baru
    if (password) {
      if (password.length < 6) {
        res.status(400).json({
          status: 'error',
          code: 'INVALID_PASSWORD',
          message: 'Password minimal 6 karakter'
        });
        return;
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update user menggunakan transaction
    const updatedUser = await prisma.$transaction(async (prisma) => {
      // Update user
      const user = await prisma.user.update({
        where: { iduser: parseInt(iduser) },
        data: updateData,
      });

      // Update role jika ada
      if (role && Object.values(EnumRole).includes(role as EnumRole)) {
        await prisma.aksesUser.update({
          where: { idakses: existingUser.akses[0].idakses },
          data: { role: role as EnumRole },
        });
      }

      return user;
    });

    // Hapus password dari response
    const { password: _, ...userWithoutPassword } = updatedUser;

    res.json({
      status: 'success',
      message: 'User berhasil diperbarui',
      data: userWithoutPassword
    });

  } catch (error) {
    console.error('Update User Error:', error);
    res.status(500).json({
      status: 'error',
      code: 'UPDATE_ERROR',
      message: 'Gagal memperbarui user',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
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

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const tokenFromHeader = authHeader && authHeader.split(' ')[1];
    const tokenFromCookie = req.cookies?.access_token;
    const token = tokenFromHeader || tokenFromCookie;

    if (!token) {
      res.status(401).json({ status: 'error', message: 'No token provided' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

    const user = await prisma.user.findUnique({
      where: { iduser: decoded.userId },
      include: { akses: true },
    });

    if (!user) {
      res.status(404).json({ status: 'error', message: 'User not found' });
      return;
    }

    res.json({
      status: 'success',
      data: {
        id: user.iduser,
        username: user.username,
        role: user.akses[0]?.role,
      },
    });
  } catch (error) {
    console.error('getCurrentUser error:', error);
    res.status(401).json({ status: 'error', message: 'Invalid token' });
  }
};
