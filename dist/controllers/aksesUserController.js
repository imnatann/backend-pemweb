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
exports.deleteAksesUser = exports.updateAksesUser = exports.createAksesUser = exports.getAksesUserById = exports.getAksesUsers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// GET /akses-users - Ambil semua akses user
const getAksesUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const aksesUsers = yield prisma.aksesUser.findMany({
            include: { user: true },
        });
        res.json(aksesUsers);
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data akses user.' });
    }
});
exports.getAksesUsers = getAksesUsers;
// GET /akses-users/:idakses - Ambil akses user tertentu
const getAksesUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idakses } = req.params;
    try {
        const aksesUser = yield prisma.aksesUser.findUnique({
            where: { idakses: parseInt(idakses) },
            include: { user: true },
        });
        if (aksesUser) {
            res.json(aksesUser);
        }
        else {
            res.status(404).json({ error: 'Akses User tidak ditemukan.' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data akses user.' });
    }
});
exports.getAksesUserById = getAksesUserById;
// POST /akses-users - Tambah akses user baru
const createAksesUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { iduser, role } = req.body;
    try {
        const newAksesUser = yield prisma.aksesUser.create({
            data: {
                iduser: iduser ? parseInt(iduser) : undefined,
                role,
            },
        });
        res.status(201).json(newAksesUser);
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal menambahkan akses user.' });
    }
});
exports.createAksesUser = createAksesUser;
// PUT /akses-users/:idakses - Perbarui akses user
const updateAksesUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idakses } = req.params;
    const { iduser, role } = req.body;
    try {
        const updatedAksesUser = yield prisma.aksesUser.update({
            where: { idakses: parseInt(idakses) },
            data: {
                iduser: iduser ? parseInt(iduser) : undefined,
                role,
            },
        });
        res.json(updatedAksesUser);
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal memperbarui akses user.' });
    }
});
exports.updateAksesUser = updateAksesUser;
// DELETE /akses-users/:idakses - Hapus akses user
const deleteAksesUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idakses } = req.params;
    try {
        yield prisma.aksesUser.delete({
            where: { idakses: parseInt(idakses) },
        });
        res.json({ message: 'Akses User berhasil dihapus.' });
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal menghapus akses user.' });
    }
});
exports.deleteAksesUser = deleteAksesUser;
