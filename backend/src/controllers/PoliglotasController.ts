import { Request, Response } from "express";
import PoliglotasService from "../services/PoliglotasService";
class PoliglotasController {
    private service: PoliglotasService;

    constructor() {
        this.service = new PoliglotasService(); // Inicializa o serviço
    }

    async atualizarTodos(req: Request, res: Response){
        try {
            await this.service.atualizarTodosPoliglotas();
            return res.status(200).json({ mensagem: "Informações dos Poliglotas atualizadas com sucesso!"})
        } catch (error) {
            console.error("Erro no controller ao atualizar:", error);
            return res.status(500).json({ erro: "Erro ao atualizar informações dos poliglotas."});
        }
    }

    async buscarNoDuolingo(req: Request, res: Response) {
        try {
            const dados = await this.service.buscarPoliglota(req.params.username);
            res.json({ success: true, data: dados });
        } catch (error) {
            res.status(404).json({ success: false, message: error.message });
        }
    }

    async buscar(req: Request, res: Response): Promise<Response> {
        try {
            const { username } = req.params; // Obtém o username da URL
            if (!username) {
                return res.status(400).json({ message: "O parâmetro 'username' é obrigatório." });
            }

            const userData = await this.service.buscarPoliglota(username);
            return res.json(userData); // Retorna os dados do usuário

        } catch (error) {
            console.error("Erro ao buscar usuário:", error);
            return res.status(500).json({ message: "Erro ao buscar usuário", error: error.message });
        }
    }

    async criar(req: Request, res: Response){
        try {
            const { username } = req.body;

            if (!username) {
                return res.status(400).json({ error: "O campo 'username' é obrigatório." });
            }

            const usuario = await this.service.buscarPoliglota(username);

            if (!usuario) {
                return res.status(404).json({ error: "Usuário não encontrado no Duolingo." });
            }

            // Cria o poliglota no banco:
            const poliglota = await this.service.criar({
                nome: username,
                idiomas: usuario.idiomas,
                xp: usuario.xp,
                ofensiva: usuario.ofensiva,
                ultimaAtividade: usuario.ultimaAtividade
            });
            return res.status(201).json(poliglota);


        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Erro ao adicionar poliglota." });
        }
    }

    async listar(req: Request, res: Response) {
        try {
            const poliglotas = await this.service.listar();
            res.json(poliglotas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        } finally {
            await this.service.desconectar(); // Limpeza
        }
    }

    async editar(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const { nome, idiomas, xp, ofensiva, ultimaAtividade } = req.body;

            const poliglota = await this.service.editar(id, nome, idiomas, xp, ofensiva, ultimaAtividade);
            return res.json(poliglota);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Erro ao editar." });
        }
    }

    async remover(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            await this.service.remover(id);
            return res.status(204).send();
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Erro ao remover." });
        }
    }
}


export default PoliglotasController;
