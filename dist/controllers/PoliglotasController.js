"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PoliglotasService_1 = __importDefault(require("../services/PoliglotasService"));
class PoliglotasController {
    atualizarTodos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield PoliglotasService_1.default.atualizarTodosPoliglotas();
                return res.status(200).json({ mensagem: "Informações dos Poliglotas atualizadas com sucesso!" });
            }
            catch (error) {
                console.error("Erro no controller ao atualizar:", error);
                return res.status(500).json({ erro: "Erro ao atualizar informações dos poliglotas." });
            }
        });
    }
    buscar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username } = req.params; // Obtém o username da URL
                if (!username) {
                    return res.status(400).json({ message: "O parâmetro 'username' é obrigatório." });
                }
                const userData = yield PoliglotasService_1.default.buscarPoliglota(username);
                return res.json(userData); // Retorna os dados do usuário
            }
            catch (error) {
                console.error("Erro ao buscar usuário:", error);
                return res.status(500).json({ message: "Erro ao buscar usuário", error: error.message });
            }
        });
    }
    criar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username } = req.body;
                if (!username) {
                    return res.status(400).json({ error: "O campo 'username' é obrigatório." });
                }
                const usuario = yield PoliglotasService_1.default.buscarPoliglota(username);
                if (!usuario) {
                    return res.status(404).json({ error: "Usuário não encontrado no Duolingo." });
                }
                // Cria o poliglota no banco
                const poliglota = yield PoliglotasService_1.default.criar(username, usuario.idiomas, usuario.xp, usuario.ofensiva, usuario.ultimaAtividade);
                return res.status(201).json(poliglota);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: "Erro ao adicionar poliglota." });
            }
        });
    }
    listar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                const poliglota = yield PoliglotasService_1.default.listar();
                return res.json(poliglota);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: "Erro ao listar poliglotas." });
            }
        });
    }
    editar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const { nome, idiomas, xp, ofensiva, ultimaAtividade } = req.body;
                const poliglota = yield PoliglotasService_1.default.editar(id, nome, idiomas, xp, ofensiva, ultimaAtividade);
                return res.json(poliglota);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: "Erro ao editar." });
            }
        });
    }
    remover(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                yield PoliglotasService_1.default.remover(id);
                return res.status(204).send();
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: "Erro ao remover." });
            }
        });
    }
    rank(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { periodo } = req.query; // Obtém o período solicitado (diario, semanal, mensal, anual)
                // Modificar para aceitar 'diario' como válido
                if (!periodo || !['diario', 'semanal', 'mensal', 'anual'].includes(periodo)) {
                    return res.status(400).json({ error: 'Período inválido. Use "diario", "semanal", "mensal" ou "anual".' });
                }
                const ranking = yield PoliglotasService_1.default.rankPorPeriodo(periodo);
                return res.json(ranking); // Retorna o ranking gerado pelo serviço
            }
            catch (error) {
                console.error("Erro ao obter ranking:", error);
                return res.status(500).json({ error: "Erro ao gerar ranking." });
            }
        });
    }
}
exports.default = new PoliglotasController();
