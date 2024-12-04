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
exports.deleteDetailPenjualan = exports.updateDetailPenjualan = exports.createDetailPenjualan = exports.getDetailPenjualanById = exports.getDetailPenjualan = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// GET /detailpenjualan - Ambil semua detail penjualan
const getDetailPenjualan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const detailPenjualan = yield prisma.detailPenjualan.findMany({
            include: {
                penjualan: true,
                barang: true,
            },
        });
        res.json(detailPenjualan);
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data detail penjualan.' });
    }
});
exports.getDetailPenjualan = getDetailPenjualan;
// GET /detailpenjualan/:iddetailpenjualan - Ambil detail penjualan tertentu
const getDetailPenjualanById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { iddetailpenjualan } = req.params;
    try {
        const detailPenjualan = yield prisma.detailPenjualan.findUnique({
            where: { iddetailpenjualan: parseInt(iddetailpenjualan) },
            include: {
                penjualan: true,
                barang: true,
            },
        });
        if (detailPenjualan) {
            res.json(detailPenjualan);
        }
        else {
            res.status(404).json({ error: 'Detail Penjualan tidak ditemukan.' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data detail penjualan.' });
    }
});
exports.getDetailPenjualanById = getDetailPenjualanById;
// POST /detailpenjualan - Tambah detail penjualan baru
const createDetailPenjualan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idpenjualan, idbarang, qty, hargajual } = req.body;
    try {
        const newDetailPenjualan = yield prisma.detailPenjualan.create({
            data: {
                idpenjualan: idpenjualan ? parseInt(idpenjualan) : undefined,
                idbarang: idbarang ? parseInt(idbarang) : undefined,
                qty,
                hargajual: parseFloat(hargajual),
            },
            include: {
                penjualan: true,
                barang: true,
            },
        });
        res.status(201).json(newDetailPenjualan);
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal menambahkan detail penjualan.' });
    }
});
exports.createDetailPenjualan = createDetailPenjualan;
// PUT /detailpenjualan/:iddetailpenjualan - Perbarui detail penjualan
const updateDetailPenjualan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { iddetailpenjualan } = req.params;
    const { idpenjualan, idbarang, qty, hargajual } = req.body;
    try {
        const updatedDetailPenjualan = yield prisma.detailPenjualan.update({
            where: { iddetailpenjualan: parseInt(iddetailpenjualan) },
            data: {
                idpenjualan: idpenjualan ? parseInt(idpenjualan) : undefined,
                idbarang: idbarang ? parseInt(idbarang) : undefined,
                qty,
                hargajual: hargajual ? parseFloat(hargajual) : undefined,
            },
            include: {
                penjualan: true,
                barang: true,
            },
        });
        res.json(updatedDetailPenjualan);
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal memperbarui detail penjualan.' });
    }
});
exports.updateDetailPenjualan = updateDetailPenjualan;
// DELETE /detailpenjualan/:iddetailpenjualan - Hapus detail penjualan
const deleteDetailPenjualan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { iddetailpenjualan } = req.params;
    try {
        yield prisma.detailPenjualan.delete({
            where: { iddetailpenjualan: parseInt(iddetailpenjualan) },
        });
        res.json({ message: 'Detail Penjualan berhasil dihapus.' });
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal menghapus detail penjualan.' });
    }
});
exports.deleteDetailPenjualan = deleteDetailPenjualan;
