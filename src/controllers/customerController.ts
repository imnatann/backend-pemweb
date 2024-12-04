import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /customer - Ambil semua customer
export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await prisma.customer.findMany({
      include: { penjualan: true },
    });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data customer.' });
  }
};

// GET /customer/:idcustomer - Ambil customer tertentu
export const getCustomerById = async (req: Request, res: Response) => {
  const { idcustomer } = req.params;
  try {
    const customer = await prisma.customer.findUnique({
      where: { idcustomer: parseInt(idcustomer) },
      include: { penjualan: true },
    });
    if (customer) {
      res.json(customer);
    } else {
      res.status(404).json({ error: 'Customer tidak ditemukan.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data customer.' });
  }
};

// POST /customer - Tambah customer baru
export const createCustomer = async (req: Request, res: Response) => {
  const { namacustomer, alamat, telepon } = req.body;
  try {
    const newCustomer = await prisma.customer.create({
      data: {
        namacustomer,
        alamat,
        telepon,
      },
    });
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json({ error: 'Gagal menambahkan customer.' });
  }
};

// PUT /customer/:idcustomer - Perbarui customer
export const updateCustomer = async (req: Request, res: Response) => {
  const { idcustomer } = req.params;
  const { namacustomer, alamat, telepon } = req.body;
  try {
    const updatedCustomer = await prisma.customer.update({
      where: { idcustomer: parseInt(idcustomer) },
      data: {
        namacustomer,
        alamat,
        telepon,
      },
    });
    res.json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ error: 'Gagal memperbarui customer.' });
  }
};

// DELETE /customer/:idcustomer - Hapus customer
export const deleteCustomer = async (req: Request, res: Response) => {
  const { idcustomer } = req.params;
  try {
    await prisma.customer.delete({
      where: { idcustomer: parseInt(idcustomer) },
    });
    res.json({ message: 'Customer berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus customer.' });
  }
};
