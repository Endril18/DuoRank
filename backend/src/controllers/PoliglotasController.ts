import { Request, Response } from "express";
import PoliglotasService from "../services/PoliglotasService";

class PoliglotasController {
    async buscar(req: Request, res: Response): Promise<Response> {
        try {
            const { username } = req.params; // Obtém o username da URL
            if (!username) {
                return res.status(400).json({ message: "O parâmetro 'username' é obrigatório." });
            }

            const userData = await PoliglotasService.buscarPoliglota(username);
            return res.json(userData); // Retorna os dados do usuário

        } catch (error) {
            console.error("Erro ao buscar usuário:", error);
            return res.status(500).json({ message: "Erro ao buscar usuário", error: error.message });
        }
    }
}

export default new PoliglotasController();
