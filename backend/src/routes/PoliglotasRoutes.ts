import { Router, Request, Response, NextFunction } from "express";
import PoliglotasController from "../controllers/PoliglotasController";

const routes = Router();

// Middleware para tratar funções assíncronas corretamente
const asyncHandler = (fn: Function) =>
    (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
};

// 🔹 Agora a rota recebe `username` como parâmetro corretamente
routes.get("/poliglota/:username", asyncHandler((req, res) => PoliglotasController.buscar(req, res)));

export default routes;
