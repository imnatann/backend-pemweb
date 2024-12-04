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
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// GET /users - Ambil semua user
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany({
            include: {
                akses: true,
                penjualan: true,
                pembelian: true,
            },
        });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data user.' });
    }
});
exports.getUsers = getUsers;
// GET /users/:iduser - Ambil user tertentu
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { iduser } = req.params;
    try {
        const user = yield prisma.user.findUnique({
            where: { iduser: parseInt(iduser) },
            include: {
                akses: true,
                penjualan: true,
                pembelian: true,
            },
        });
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).json({ error: 'User tidak ditemukan.' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data user.' });
    }
});
exports.getUserById = getUserById;
// POST /users - Tambah user baru
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const newUser = yield prisma.user.create({
            data: {
                username,
                password,
            },
        });
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal menambahkan user.' });
    }
});
exports.createUser = createUser;
// PUT /users/:iduser - Perbarui user
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { iduser } = req.params;
    const { username, password } = req.body;
    try {
        const updatedUser = yield prisma.user.update({
            where: { iduser: parseInt(iduser) },
            data: {
                username,
                password,
            },
        });
        res.json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal memperbarui user.' });
    }
});
exports.updateUser = updateUser;
// DELETE /users/:iduser - Hapus user
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { iduser } = req.params;
    try {
        yield prisma.user.delete({
            where: { iduser: parseInt(iduser) },
        });
        res.json({ message: 'User berhasil dihapus.' });
    }
    catch (error) {
        res.status(500).json({ error: 'Gagal menghapus user.' });
    }
});
exports.deleteUser = deleteUser;
