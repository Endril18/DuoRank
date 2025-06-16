import { Router, Request, Response, NextFunction } from "express";
import PoliglotasController from "../controllers/PoliglotasController.js";

const router = Router();
const controller = new PoliglotasController();

// Middleware para tratamento assíncrono
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
    (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

// Rotas da API
router.get("/", asyncHandler((req, res, next) => controller.listar(req, res, next)));
router.post("/", asyncHandler((req, res, next) => controller.criar(req, res, next)));
router.get("/buscar/:username", asyncHandler((req, res, next) => controller.buscar(req, res, next)));
router.get("/buscar-no-duo/:username", asyncHandler((req, res, next) => controller.buscarNoDuolingo(req, res, next)));
router.put("/:id", asyncHandler((req, res, next) => controller.editar(req, res, next)));
router.delete("/:id", asyncHandler((req, res, next) => controller.remover(req, res, next)));
router.post("/atualizar-todos", asyncHandler((req, res, next) => controller.atualizarTodos(req, res, next)));

export default router;