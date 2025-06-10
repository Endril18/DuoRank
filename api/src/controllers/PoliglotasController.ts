import { Request, Response, NextFunction } from "express";
import PoliglotasService from "../services/PoliglotasService";
class PoliglotasController {
    private service: PoliglotasService;

    constructor() {
        this.service = new PoliglotasService(); // Inicializa o serviço
    }

    async atualizarTodos(req: Request, res: Response, next: NextFunction){
        try {
            await this.service.atualizarTodosPoliglotas();
            return res.status(200).json({ mensagem: "Informações dos Poliglotas atualizadas com sucesso!"})
        } catch (error) {
            console.error("Erro no controller ao atualizar:", error);
            return res.status(500).json({ erro: "Erro ao atualizar informações dos poliglotas."});
        }
    }

    async buscarNoDuolingo(req: Request, res: Response, next: NextFunction) {
        try {
            const dados = await this.service.buscarPoliglota(req.params.username);
            res.json({ success: true, data: dados });
        } catch (error) {
            console.error(`Erro ao buscar ${req.params.username} no Duolingo:`, error);
            next(error); // Encaminha para o middleware de erro
        }
    }

    async buscar(req: Request, res: Response, next: NextFunction){
        try {
            const { username } = req.params;
            if (!username) {
                return res.status(400).json({
                    message: "O parâmetro 'username' é obrigatório."
                });
            }

            const poliglota = await this.service.buscarPoliglotaNoBanco(username);

            if (!poliglota) {
                return res.status(404).json({
                    message: "Esse Poliglota não está cadastrado."
                });
            }

            return res.json(poliglota);

        } catch (error) {
            console.error("Erro ao buscar:", error);
            return res.status(500).json({
                message: "Erro interno ao buscar Poliglota"
            });
        }
    }

    async criar(req: Request, res: Response, next: NextFunction){
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

    async listar(req: Request, res: Response, next: NextFunction) {
        try {
            const poliglotas = await this.service.listar();
            res.json(poliglotas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        } finally {
            await this.service.desconectar(); // Limpeza
        }
    }

    async editar(req: Request, res: Response, next: NextFunction) {
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

    async remover(req: Request, res: Response, next: NextFunction) {
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
