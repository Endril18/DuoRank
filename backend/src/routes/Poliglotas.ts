import { Router } from "express";
import PoliglotasController from "../controllers/PoliglotasController";

const router = Router();
const controller = new PoliglotasController();

router.put("/atualizar-todos", async (req, res) => { await controller.atualizarTodos(req, res); });

// Middleware para tratamento assíncrono (melhor implementação)
const asyncHandler = (fn: Function) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };

// Rotas da API
router.get("/", asyncHandler(PoliglotasController.listarPoliglotas));
router.post("/", asyncHandler(PoliglotasController.criarPoliglota));
router.get("/buscar/:username", asyncHandler(PoliglotasController.buscarNoDuolingo));
router.get("/:id", asyncHandler(PoliglotasController.obterPoliglota));
router.put("/:id", asyncHandler(PoliglotasController.atualizarPoliglota));
router.delete("/:id", asyncHandler(PoliglotasController.removerPoliglota));
router.post("/atualizar-todos", asyncHandler(PoliglotasController.atualizarTodosPoliglotas));

export default router;