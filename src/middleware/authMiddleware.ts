// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: {
    userId: number;
    role: string;
  };
}

// Middleware untuk memverifikasi token JWT
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers['authorization'];
    const tokenFromHeader = authHeader && authHeader.split(' ')[1];
    const tokenFromCookie = req.cookies?.access_token; // Gunakan optional chaining
    const token = tokenFromHeader || tokenFromCookie;

    if (!token) {
      res.status(401).json({ error: 'Token tidak ditemukan.' });
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
      if (err) {
        res.status(403).json({ error: 'Token tidak valid.' });
        return;
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Middleware untuk otorisasi berdasarkan peran
export const authorizeRoles = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Tidak terautentikasi.' });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Tidak memiliki akses.' });
      return;
    }
    next();
  };
};
