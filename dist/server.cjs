"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const Poliglotas_1 = __importDefault(require("./routes/Poliglotas"));
const ranking_1 = __importDefault(require("./routes/ranking"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/poliglotas", Poliglotas_1.default);
app.use("/poliglotas/rank", ranking_1.default);
app.get("/", (req, res) => {
    res.send("API do Poliglotas está rodando!");
});
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
