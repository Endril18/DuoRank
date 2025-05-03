import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import PoliglotasRoutes from "./routes/PoliglotasRoutes";
import ranking from "./routes/ranking";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/poliglotas", PoliglotasRoutes);
app.use("/poliglotas/rank", ranking);


app.get("/", (req, res) => {
    res.send("Poliglotas está rodando!");
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

//acessar navegador localhost ou usar curl http://localhost:3000/ no terminal