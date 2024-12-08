// src/controllers/authController.ts
import { Request, Response } from 'express';
import { PrismaClient, EnumRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid'; // Tambahkan uuid untuk generate refresh token


const prisma = new PrismaClient();

// POST /auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
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
      message: 'User berhasil didaftarkan',
      data: userWithoutPassword
    });

  } catch (error) {
    console.error('Register Error:', error);

    if (error instanceof Error) {
      res.status(500).json({
        status: 'error',
        code: 'REGISTRATION_ERROR',
        message: 'Gagal mendaftarkan user',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    } else {
      res.status(500).json({
        status: 'error',
        code: 'UNKNOWN_ERROR',
        message: 'Terjadi kesalahan yang tidak diketahui'
      });
    }
  }
};
// Fungsi untuk generate tokens
const generateTokens = (userId: number, role: EnumRole, username: string) => {
    const accessToken = jwt.sign(
      { userId, role, username },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );
  
    const refreshToken = jwt.sign(
      { userId, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );
  
    return { accessToken, refreshToken };
  };
  
  // Fungsi untuk menyimpan session
  const createSession = async (
    userId: number,
    token: string,
    refreshToken: string,
    req: Request
  ) => {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour
  
    return prisma.userSession.create({
      data: {
        iduser: userId,
        token,
        refresh_token: refreshToken,
        expires_at: expiresAt,
        ip_address: req.ip,
        user_agent: req.headers['user-agent'] || null,
      },
    });
  };
  
  // POST /auth/login
  export const login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password } = req.body;
  
      // Validasi input
      if (!username || !password) {
        res.status(400).json({
          status: 'error',
          code: 'VALIDATION_ERROR',
          message: 'Data tidak lengkap',
          details: {
            username: !username ? 'Username diperlukan' : null,
            password: !password ? 'Password diperlukan' : null
          }
        });
        return; // Make sure to return here
      }
  
      // Cari user dengan akses
      const user = await prisma.user.findUnique({
        where: { username },
        include: {
          akses: true,
        },
      });
  
      if (!user || !user.akses[0]) {
        res.status(401).json({
          status: 'error',
          code: 'INVALID_CREDENTIALS',
          message: 'Username atau password salah'
        });
        return; // Make sure to return here
      }
  
      // Verifikasi password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({
          status: 'error',
          code: 'INVALID_CREDENTIALS',
          message: 'Username atau password salah'
        });
        return; // Make sure to return here
      }
  
      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(
        user.iduser,
        user.akses[0].role,
        user.username
      );
  
      try {
        // Invalidate existing sessions (optional)
        await prisma.userSession.updateMany({
          where: {
            iduser: user.iduser,
            is_valid: true,
          },
          data: {
            is_valid: false,
          },
        });
  
        // Create new session
        const session = await createSession(
          user.iduser,
          accessToken,
          refreshToken,
          req
        );
  
        // Set cookies first
        res.cookie('access_token', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 1000, // 1 hour
        });
  
        res.cookie('refresh_token', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
  
        // Then send the JSON response (only once!)
        res.json({
          status: 'success',
          message: 'Login berhasil',
          data: {
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_at: session.expires_at,
            user: {
              id: user.iduser,
              username: user.username,
              role: user.akses[0].role,
              created_at: user.created_at
            }
          }
        });
      } catch (error) {
        // Handle session creation error
        console.error('Session creation error:', error);
        res.status(500).json({
          status: 'error',
          code: 'SESSION_ERROR',
          message: 'Gagal membuat session'
        });
        return;
      }
  
    } catch (error) {
      console.error('Login Error:', error);
      // Only send error response if no response has been sent yet
      if (!res.headersSent) {
        res.status(500).json({
          status: 'error',
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Terjadi kesalahan internal server',
          details: process.env.NODE_ENV === 'development' ? error : undefined
        });
      }
    }
  };
  
  // POST /auth/refresh-token
  export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { refresh_token } = req.body;
  
      if (!refresh_token) {
        res.status(400).json({
          status: 'error',
          code: 'INVALID_TOKEN',
          message: 'Refresh token diperlukan'
        });
        return;
      }
  
      // Cari session yang valid
      const session = await prisma.userSession.findFirst({
        where: {
          refresh_token,
          is_valid: true,
          expires_at: {
            gt: new Date(),
          },
        },
        include: {
          user: {
            include: {
              akses: true,
            },
          },
        },
      });
  
      if (!session || !session.user.akses[0]) {
        res.status(401).json({
          status: 'error',
          code: 'INVALID_TOKEN',
          message: 'Refresh token tidak valid'
        });
        return;
      }
  
      // Generate token baru
      const { accessToken, refreshToken: newRefreshToken } = generateTokens(
        session.user.iduser,
        session.user.akses[0].role,
        session.user.username
      );
  
      // Update session
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);
  
      await prisma.userSession.update({
        where: { idsession: session.idsession },
        data: {
          token: accessToken,
          refresh_token: newRefreshToken,
          expires_at: expiresAt,
        },
      });
  
      res.json({
        status: 'success',
        message: 'Token berhasil diperbarui',
        data: {
          access_token: accessToken,
          refresh_token: newRefreshToken,
          expires_at: expiresAt,
        },
      });
  
    } catch (error) {
      console.error('Refresh Token Error:', error);
      res.status(500).json({
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Terjadi kesalahan internal server',
      });
    }
  };
  
  // POST /auth/logout
  export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];
  
      if (!token) {
        res.status(400).json({
          status: 'error',
          code: 'INVALID_TOKEN',
          message: 'Token diperlukan'
        });
        return;
      }
  
      // Invalidate session
      await prisma.userSession.updateMany({
        where: {
          token,
          is_valid: true,
        },
        data: {
          is_valid: false,
        },
      });
  
      res.json({
        status: 'success',
        message: 'Logout berhasil'
      });
  
    } catch (error) {
      console.error('Logout Error:', error);
      res.status(500).json({
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Terjadi kesalahan internal server',
      });
    }
  };
