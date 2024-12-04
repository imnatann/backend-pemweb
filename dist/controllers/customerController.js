"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomer = exports.updateCustomer = exports.createCustomer = exports.getCustomerById = exports.getCustomers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// GET /customer - Ambil semua customer
const getCustomers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customers = yield prisma.customer.findMany({
            include: { penjualan: true },
        });
        res.json(customers);
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data customer.' });
    }
});
exports.getCustomers = getCustomers;
// GET /customer/:idcustomer - Ambil customer tertentu
const getCustomerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idcustomer } = req.params;
    try {
        const customer = yield prisma.customer.findUnique({
            where: { idcustomer: parseInt(idcustomer) },
            include: { penjualan: true },
        });
        if (customer) {
            res.json(customer);
        }
        else {
            res.status(404).json({ error: 'Customer tidak ditemukan.' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data customer.' });
    }
});
exports.getCustomerById = getCustomerById;
// POST /customer - Tambah customer baru
const createCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { namacustomer, alamat, telepon } = req.body;
    try {
        const newCustomer = yield prisma.customer.create({
            data: {
                namacustomer,
                alamat,
                telepon,
            },
        });
        res.status(201).json(newCustomer);
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal menambahkan customer.' });
    }
});
exports.createCustomer = createCustomer;
// PUT /customer/:idcustomer - Perbarui customer
const updateCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idcustomer } = req.params;
    const { namacustomer, alamat, telepon } = req.body;
    try {
        const updatedCustomer = yield prisma.customer.update({
            where: { idcustomer: parseInt(idcustomer) },
            data: {
                namacustomer,
                alamat,
                telepon,
            },
        });
        res.json(updatedCustomer);
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal memperbarui customer.' });
    }
});
exports.updateCustomer = updateCustomer;
// DELETE /customer/:idcustomer - Hapus customer
const deleteCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idcustomer } = req.params;
    try {
        yield prisma.customer.delete({
            where: { idcustomer: parseInt(idcustomer) },
        });
        res.json({ message: 'Customer berhasil dihapus.' });
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal menghapus customer.' });
    }
});
exports.deleteCustomer = deleteCustomer;
