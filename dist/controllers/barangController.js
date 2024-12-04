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
exports.deleteBarang = exports.updateBarang = exports.createBarang = exports.getBarangById = exports.getBarang = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// GET /barang - Ambil semua barang
const getBarang = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const barang = yield prisma.barang.findMany({
            include: {
                detailpembelian: true,
                detailpenjualan: true,
            },
        });
        res.json(barang);
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data barang.' });
    }
});
exports.getBarang = getBarang;
// GET /barang/:idbarang - Ambil barang tertentu
const getBarangById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idbarang } = req.params;
    try {
        const barang = yield prisma.barang.findUnique({
            where: { idbarang: parseInt(idbarang) },
            include: {
                detailpembelian: true,
                detailpenjualan: true,
            },
        });
        if (barang) {
            res.json(barang);
        }
        else {
            res.status(404).json({ error: 'Barang tidak ditemukan.' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data barang.' });
    }
});
exports.getBarangById = getBarangById;
// POST /barang - Tambah barang baru
const createBarang = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { namabarang, kategori, hargabeli, hargajual, stok } = req.body;
    try {
        const newBarang = yield prisma.barang.create({
            data: {
                namabarang,
                kategori,
                hargabeli: hargabeli ? parseFloat(hargabeli) : undefined,
                hargajual: hargajual ? parseFloat(hargajual) : undefined,
                stok: stok || 0,
            },
        });
        res.status(201).json(newBarang);
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal menambahkan barang.' });
    }
});
exports.createBarang = createBarang;
// PUT /barang/:idbarang - Perbarui barang
const updateBarang = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idbarang } = req.params;
    const { namabarang, kategori, hargabeli, hargajual, stok } = req.body;
    try {
        const updatedBarang = yield prisma.barang.update({
            where: { idbarang: parseInt(idbarang) },
            data: {
                namabarang,
                kategori,
                hargabeli: hargabeli ? parseFloat(hargabeli) : undefined,
                hargajual: hargajual ? parseFloat(hargajual) : undefined,
                stok: stok !== undefined ? stok : undefined,
            },
        });
        res.json(updatedBarang);
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal memperbarui barang.' });
    }
});
exports.updateBarang = updateBarang;
// DELETE /barang/:idbarang - Hapus barang
const deleteBarang = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idbarang } = req.params;
    try {
        yield prisma.barang.delete({
            where: { idbarang: parseInt(idbarang) },
        });
        res.json({ message: 'Barang berhasil dihapus.' });
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal menghapus barang.' });
    }
});
exports.deleteBarang = deleteBarang;
