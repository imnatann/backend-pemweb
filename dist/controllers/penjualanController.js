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
exports.deletePenjualan = exports.updatePenjualan = exports.createPenjualan = exports.getPenjualanById = exports.getPenjualan = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// GET /penjualan - Ambil semua penjualan
const getPenjualan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const penjualan = yield prisma.penjualan.findMany({
            include: {
                customer: true,
                user: true,
                detailpenjualan: true,
            },
        });
        res.json(penjualan);
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data penjualan.' });
    }
});
exports.getPenjualan = getPenjualan;
// GET /penjualan/:idpenjualan - Ambil penjualan tertentu
const getPenjualanById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idpenjualan } = req.params;
    try {
        const penjualan = yield prisma.penjualan.findUnique({
            where: { idpenjualan: parseInt(idpenjualan) },
            include: {
                customer: true,
                user: true,
                detailpenjualan: true,
            },
        });
        if (penjualan) {
            res.json(penjualan);
        }
        else {
            res.status(404).json({ error: 'Penjualan tidak ditemukan.' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data penjualan.' });
    }
});
exports.getPenjualanById = getPenjualanById;
// POST /penjualan - Tambah penjualan baru
const createPenjualan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tanggal, idcustomer, iduser, detailpenjualan } = req.body;
    try {
        const newPenjualan = yield prisma.penjualan.create({
            data: {
                tanggal: new Date(tanggal),
                idcustomer: idcustomer ? parseInt(idcustomer) : undefined,
                iduser: iduser ? parseInt(iduser) : undefined,
                detailpenjualan: {
                    create: detailpenjualan.map((detail) => ({
                        idbarang: detail.idbarang ? parseInt(detail.idbarang) : undefined,
                        qty: detail.qty,
                        hargajual: parseFloat(detail.hargajual),
                    })),
                },
            },
            include: {
                customer: true,
                user: true,
                detailpenjualan: true,
            },
        });
        res.status(201).json(newPenjualan);
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal menambahkan penjualan.' });
    }
});
exports.createPenjualan = createPenjualan;
// PUT /penjualan/:idpenjualan - Perbarui penjualan
const updatePenjualan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idpenjualan } = req.params;
    const { tanggal, idcustomer, iduser, detailpenjualan } = req.body;
    try {
        const updatedPenjualan = yield prisma.penjualan.update({
            where: { idpenjualan: parseInt(idpenjualan) },
            data: {
                tanggal: tanggal ? new Date(tanggal) : undefined,
                idcustomer: idcustomer ? parseInt(idcustomer) : undefined,
                iduser: iduser ? parseInt(iduser) : undefined,
                // Untuk detailpenjualan, handling terpisah diperlukan
            },
            include: {
                customer: true,
                user: true,
                detailpenjualan: true,
            },
        });
        res.json(updatedPenjualan);
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal memperbarui penjualan.' });
    }
});
exports.updatePenjualan = updatePenjualan;
// DELETE /penjualan/:idpenjualan - Hapus penjualan
const deletePenjualan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idpenjualan } = req.params;
    try {
        yield prisma.penjualan.delete({
            where: { idpenjualan: parseInt(idpenjualan) },
        });
        res.json({ message: 'Penjualan berhasil dihapus.' });
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal menghapus penjualan.' });
    }
});
exports.deletePenjualan = deletePenjualan;
