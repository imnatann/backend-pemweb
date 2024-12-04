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
exports.deleteDetailPembelian = exports.updateDetailPembelian = exports.createDetailPembelian = exports.getDetailPembelianById = exports.getDetailPembelian = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// GET /detailpembelian - Ambil semua detail pembelian
const getDetailPembelian = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const detailPembelian = yield prisma.detailPembelian.findMany({
            include: {
                pembelian: true,
                barang: true,
            },
        });
        res.json(detailPembelian);
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data detail pembelian.' });
    }
});
exports.getDetailPembelian = getDetailPembelian;
// GET /detailpembelian/:iddetailpembelian - Ambil detail pembelian tertentu
const getDetailPembelianById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { iddetailpembelian } = req.params;
    try {
        const detailPembelian = yield prisma.detailPembelian.findUnique({
            where: { iddetailpembelian: parseInt(iddetailpembelian) },
            include: {
                pembelian: true,
                barang: true,
            },
        });
        if (detailPembelian) {
            res.json(detailPembelian);
        }
        else {
            res.status(404).json({ error: 'Detail Pembelian tidak ditemukan.' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data detail pembelian.' });
    }
});
exports.getDetailPembelianById = getDetailPembelianById;
// POST /detailpembelian - Tambah detail pembelian baru
const createDetailPembelian = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idpembelian, idbarang, qty, hargabeli } = req.body;
    try {
        const newDetailPembelian = yield prisma.detailPembelian.create({
            data: {
                idpembelian: idpembelian ? parseInt(idpembelian) : undefined,
                idbarang: idbarang ? parseInt(idbarang) : undefined,
                qty,
                hargabeli: parseFloat(hargabeli),
            },
            include: {
                pembelian: true,
                barang: true,
            },
        });
        res.status(201).json(newDetailPembelian);
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal menambahkan detail pembelian.' });
    }
});
exports.createDetailPembelian = createDetailPembelian;
// PUT /detailpembelian/:iddetailpembelian - Perbarui detail pembelian
const updateDetailPembelian = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { iddetailpembelian } = req.params;
    const { idpembelian, idbarang, qty, hargabeli } = req.body;
    try {
        const updatedDetailPembelian = yield prisma.detailPembelian.update({
            where: { iddetailpembelian: parseInt(iddetailpembelian) },
            data: {
                idpembelian: idpembelian ? parseInt(idpembelian) : undefined,
                idbarang: idbarang ? parseInt(idbarang) : undefined,
                qty,
                hargabeli: hargabeli ? parseFloat(hargabeli) : undefined,
            },
            include: {
                pembelian: true,
                barang: true,
            },
        });
        res.json(updatedDetailPembelian);
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal memperbarui detail pembelian.' });
    }
});
exports.updateDetailPembelian = updateDetailPembelian;
// DELETE /detailpembelian/:iddetailpembelian - Hapus detail pembelian
const deleteDetailPembelian = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { iddetailpembelian } = req.params;
    try {
        yield prisma.detailPembelian.delete({
            where: { iddetailpembelian: parseInt(iddetailpembelian) },
        });
        res.json({ message: 'Detail Pembelian berhasil dihapus.' });
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal menghapus detail pembelian.' });
    }
});
exports.deleteDetailPembelian = deleteDetailPembelian;
