import { Request, Response } from "express";
import PoliglotasService from "../services/PoliglotasService";

class PoliglotasController {

    async atualizarTodos(req: Request, res: Response){
        try {
            await PoliglotasService.atualizarTodosPoliglotas();
            return res.status(200).json({ mensagem: "Informações dos Poliglotas atualizadas com sucesso!"})
        } catch (error) {
            console.error("Erro no controller ao atualizar:", error);
            return res.status(500).json({ erro: "Erro ao atualizar informações dos poliglotas."});
        }
    }

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

    async criar(req: Request, res: Response){
        try {
            const { username } = req.body;
            //console.log("nome", username);

            const usuario = await PoliglotasService.buscarPoliglota(username);

            if (!usuario) {
                return res.status(404).json({ error: "Usuário não encontrado no Duolingo." });
            }

            //console.log("Usuário encontrado:", usuario);
            if (!username) {
                return res.status(400).json({ error: "O campo 'username' é obrigatório." });
            }

            //const idiomasString = usuario.idiomas.join(", ");
            const poliglota = await PoliglotasService.criar(username, usuario.idiomas, usuario.xp, usuario.ofensiva, usuario.ultimaAtividade);
            return res.status(201).json(poliglota);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Erro ao criar ." });
        }
    }

    async listar(req: Request, res: Response) {
        try {
            const { id } = req.query;
            const poliglota = await PoliglotasService.listar();
            return res.json(poliglota);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Erro ao listar." });
        }
    }

    async editar(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const { nome, idiomas, xp, ofensiva, ultimaAtividade } = req.body;
            const poliglota = await PoliglotasService.editar(id, nome, idiomas, xp, ofensiva, ultimaAtividade);
            return res.json(poliglota);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Erro ao editar." });
        }
    }

    async remover(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            await PoliglotasService.remover(id);
            return res.status(204).send();
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Erro ao remover ." });
        }
    }
}


export default new PoliglotasController();
