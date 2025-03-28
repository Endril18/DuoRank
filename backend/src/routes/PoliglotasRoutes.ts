import { Router, Request, Response, NextFunction } from "express";
import PoliglotasController from "../controllers/PoliglotasController";


// Middleware para tratar funções assíncronas corretamente
const asyncHandler = (fn: Function) =>
    (req: Request, res: Response, next: NextFunction) => {
        return Promise.resolve(fn(req, res, next)).catch(next);
    };

const routes = Router();

// 🔹 Agora a rota recebe `username` como parâmetro corretamente
routes.get("/:username", asyncHandler((req, res) => PoliglotasController.buscar(req, res)));
routes.put("/:id", asyncHandler((req, res) => PoliglotasController.editar(req, res)));
routes.delete("/:id", asyncHandler((req, res) => PoliglotasController.remover(req, res)));
routes.get("/", asyncHandler((req, res) => PoliglotasController.listar(req, res)));
routes.put("/atualizar-todos", asyncHandler((req, res) => PoliglotasController.atualizarTodos(req, res)));


export default routes;
