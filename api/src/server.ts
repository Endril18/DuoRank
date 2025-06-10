import express from "express";
import { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import Poliglotas from "./routes/PoliglotasRoutes";

dotenv.config();

const app = express();

// Middlewares
// Configuração do CORS para permitir o frontend
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json()); // Corrigido o erro de digitação

// Rotas
app.use("/api/poliglotas", Poliglotas);

// Rota de health check
app.get("/api", (req, res) => {
    res.json({
        status: "online",
        message: "Servidor está rodando corretamente",
        version: "1.0.0"
    });
});

// Middleware de erro (DEVE ser o último)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Erro:', err.message);
    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'development'
            ? err.message
            : 'Erro interno'
    });
});

// Inicialização
const PORT = process.env.PORT || 12110;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});