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
exports.deleteSupplier = exports.updateSupplier = exports.createSupplier = exports.getSupplierById = exports.getSuppliers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// GET /supplier - Ambil semua supplier
const getSuppliers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const suppliers = yield prisma.supplier.findMany({
            include: { pembelian: true },
        });
        res.json(suppliers);
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data supplier.' });
    }
});
exports.getSuppliers = getSuppliers;
// GET /supplier/:idsupplier - Ambil supplier tertentu
const getSupplierById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idsupplier } = req.params;
    try {
        const supplier = yield prisma.supplier.findUnique({
            where: { idsupplier: parseInt(idsupplier) },
            include: { pembelian: true },
        });
        if (supplier) {
            res.json(supplier);
        }
        else {
            res.status(404).json({ error: 'Supplier tidak ditemukan.' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data supplier.' });
    }
});
exports.getSupplierById = getSupplierById;
// POST /supplier - Tambah supplier baru
const createSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { namasupplier, alamat, telepon } = req.body;
    try {
        const newSupplier = yield prisma.supplier.create({
            data: {
                namasupplier,
                alamat,
                telepon,
            },
        });
        res.status(201).json(newSupplier);
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal menambahkan supplier.' });
    }
});
exports.createSupplier = createSupplier;
// PUT /supplier/:idsupplier - Perbarui supplier
const updateSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idsupplier } = req.params;
    const { namasupplier, alamat, telepon } = req.body;
    try {
        const updatedSupplier = yield prisma.supplier.update({
            where: { idsupplier: parseInt(idsupplier) },
            data: {
                namasupplier,
                alamat,
                telepon,
            },
        });
        res.json(updatedSupplier);
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal memperbarui supplier.' });
    }
});
exports.updateSupplier = updateSupplier;
// DELETE /supplier/:idsupplier - Hapus supplier
const deleteSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idsupplier } = req.params;
    try {
        yield prisma.supplier.delete({
            where: { idsupplier: parseInt(idsupplier) },
        });
        res.json({ message: 'Supplier berhasil dihapus.' });
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal menghapus supplier.' });
    }
});
exports.deleteSupplier = deleteSupplier;
