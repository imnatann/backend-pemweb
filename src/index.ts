import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

// Import Routes
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import aksesUserRoutes from './routes/aksesUserRoutes';
import barangRoutes from './routes/barangRoutes';
import supplierRoutes from './routes/supplierRoutes';
import customerRoutes from './routes/customerRoutes';
import pembelianRoutes from './routes/pembelianRoutes';
import penjualanRoutes from './routes/penjualanRoutes';
import detailPembelianRoutes from './routes/detailPembelianRoutes';
import detailPenjualanRoutes from './routes/detailPenjualanRoutes';
import stokRoutes from './routes/stokRoutes';
import cookieParser from 'cookie-parser';


dotenv.config();

const app = express();
const prisma = new PrismaClient();

// CORS Middleware
app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle Preflight Requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log('Request Body:', req.body);
  console.log('Request Path:', req.path);
  console.log('Request Method:', req.method);
  next();
});
app.use(logger);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(cookieParser()); // Tambahkan ini sebelum routes


// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/akses-users', aksesUserRoutes);
app.use('/barang', barangRoutes);
app.use('/supplier', supplierRoutes);
app.use('/customer', customerRoutes);
app.use('/pembelian', pembelianRoutes);
app.use('/penjualan', penjualanRoutes);
app.use('/detailpembelian', detailPembelianRoutes);
app.use('/detailpenjualan', detailPenjualanRoutes);
app.use('/stok', stokRoutes);

// Route Default
app.get('/', (req: Request, res: Response) => {
  res.send('API Berjalan dengan Baik!');
});

// Error Handling Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});