import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Poliglotas from "./routes/Poliglotas";

dotenv.config();

const app = express();

// Configuração do CORS para permitir o frontend
app.use(cors({ origin: "http://localhost:5173/" }));
app.use(express.json()); // Corrigido o erro de digitação

// Rotas
app.use("/api/poliglotas", Poliglotas);
app.get("/api", (req, res) => {
    res.send("API do Poliglotas está rodando!");
});

// Porta do servidor
const PORT = process.env.PORT || 12110; // Porta padrão caso não esteja no .env
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});