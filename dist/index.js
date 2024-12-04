"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = require("./utils/logger");
// Import Routes
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const aksesUserRoutes_1 = __importDefault(require("./routes/aksesUserRoutes"));
const barangRoutes_1 = __importDefault(require("./routes/barangRoutes"));
const supplierRoutes_1 = __importDefault(require("./routes/supplierRoutes"));
const customerRoutes_1 = __importDefault(require("./routes/customerRoutes"));
const pembelianRoutes_1 = __importDefault(require("./routes/pembelianRoutes"));
const penjualanRoutes_1 = __importDefault(require("./routes/penjualanRoutes"));
const detailPembelianRoutes_1 = __importDefault(require("./routes/detailPembelianRoutes"));
const detailPenjualanRoutes_1 = __importDefault(require("./routes/detailPenjualanRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
// Middleware
app.use(express_1.default.json());
app.use(logger_1.logger);
// Routes
app.use('/users', userRoutes_1.default);
app.use('/akses-users', aksesUserRoutes_1.default);
app.use('/barang', barangRoutes_1.default);
app.use('/supplier', supplierRoutes_1.default);
app.use('/customer', customerRoutes_1.default);
app.use('/pembelian', pembelianRoutes_1.default);
app.use('/penjualan', penjualanRoutes_1.default);
app.use('/detailpembelian', detailPembelianRoutes_1.default);
app.use('/detailpenjualan', detailPenjualanRoutes_1.default);
// Route Default
app.get('/', (req, res) => {
    res.send('API Berjalan dengan Baik!');
});
// Error Handling Middleware
app.use(errorHandler_1.errorHandler);
// Mulai Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
