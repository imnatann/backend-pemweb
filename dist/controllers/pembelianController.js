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
exports.deletePembelian = exports.updatePembelian = exports.createPembelian = exports.getPembelianById = exports.getPembelian = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// GET /pembelian - Ambil semua pembelian
const getPembelian = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pembelian = yield prisma.pembelian.findMany({
            include: {
                supplier: true,
                user: true,
                detailpembelian: true,
            },
        });
        res.json(pembelian);
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data pembelian.' });
    }
});
exports.getPembelian = getPembelian;
// GET /pembelian/:idpembelian - Ambil pembelian tertentu
const getPembelianById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idpembelian } = req.params;
    try {
        const pembelian = yield prisma.pembelian.findUnique({
            where: { idpembelian: parseInt(idpembelian) },
            include: {
                supplier: true,
                user: true,
                detailpembelian: true,
            },
        });
        if (pembelian) {
            res.json(pembelian);
        }
        else {
            res.status(404).json({ error: 'Pembelian tidak ditemukan.' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data pembelian.' });
    }
});
exports.getPembelianById = getPembelianById;
// POST /pembelian - Tambah pembelian baru
const createPembelian = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tanggal, idsupplier, iduser, detailpembelian } = req.body;
    try {
        const newPembelian = yield prisma.pembelian.create({
            data: {
                tanggal: new Date(tanggal),
                idsupplier: idsupplier ? parseInt(idsupplier) : undefined,
                iduser: iduser ? parseInt(iduser) : undefined,
                detailpembelian: {
                    create: detailpembelian.map((detail) => ({
                        idbarang: detail.idbarang ? parseInt(detail.idbarang) : undefined,
                        qty: detail.qty,
                        hargabeli: parseFloat(detail.hargabeli),
                    })),
                },
            },
            include: {
                supplier: true,
                user: true,
                detailpembelian: true,
            },
        });
        res.status(201).json(newPembelian);
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal menambahkan pembelian.' });
    }
});
exports.createPembelian = createPembelian;
// PUT /pembelian/:idpembelian - Perbarui pembelian
const updatePembelian = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idpembelian } = req.params;
    const { tanggal, idsupplier, iduser, detailpembelian } = req.body;
    try {
        const updatedPembelian = yield prisma.pembelian.update({
            where: { idpembelian: parseInt(idpembelian) },
            data: {
                tanggal: tanggal ? new Date(tanggal) : undefined,
                idsupplier: idsupplier ? parseInt(idsupplier) : undefined,
                iduser: iduser ? parseInt(iduser) : undefined,
                // Untuk detailpembelian, biasanya kita perlu handling terpisah (create/update/delete)
            },
            include: {
                supplier: true,
                user: true,
                detailpembelian: true,
            },
        });
        res.json(updatedPembelian);
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal memperbarui pembelian.' });
    }
});
exports.updatePembelian = updatePembelian;
// DELETE /pembelian/:idpembelian - Hapus pembelian
const deletePembelian = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idpembelian } = req.params;
    try {
        yield prisma.pembelian.delete({
            where: { idpembelian: parseInt(idpembelian) },
        });
        res.json({ message: 'Pembelian berhasil dihapus.' });
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal menghapus pembelian.' });
    }
});
exports.deletePembelian = deletePembelian;
