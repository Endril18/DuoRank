import { Router, Request, Response, NextFunction } from "express";
//tamo roteando e exportando
import PoliglotasController from "../controllers/PoliglotasController";

const router: Router = Router();
//resolvedor de problema

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

//mapeando os endpoints do sistema
router.post("/", asyncHandler((req: Request, res: Response) => PoliglotasController.criar(req, res)));
router.get("/", asyncHandler((req: Request, res: Response) => PoliglotasController.listar(req, res)));
router.put("/:id", asyncHandler((req: Request, res: Response) => PoliglotasController.editar(req, res)));
router.delete("/:id", asyncHandler((req: Request, res: Response) => PoliglotasController.remover(req, res)));

export default router;