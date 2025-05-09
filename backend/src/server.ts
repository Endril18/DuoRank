import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Poliglotas from "./routes/Poliglotas";
import ranking from "./routes/ranking";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/poliglotas", Poliglotas);
app.use("/poliglotas/rank", ranking);
app.get("/", (req, res) => {
    res.send("API do Poliglotas está rodando!");
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});