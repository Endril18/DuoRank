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
const client_1 = require("@prisma/client"); //importar o client do prisma que vai lidar com o banco de dados
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
class PoliglotasService {
    buscarPoliglota(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = `${process.env.BASE_ENDPOINT_URL}${username}`; // usar .env
                const response = yield axios_1.default.get(url, {
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'Mozilla/5.0' // Simula um navegador
                    }
                });
                return this.extrairDados(response.data);
            }
            catch (error) {
                console.error("Erro ao buscar usuário:", error);
                throw new Error("Erro ao obter os dados do usuário");
            }
        });
    }
    // Atualizar dados de todos os usuários cadastrados
    atualizarTodosPoliglotas() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const poliglotas = yield prisma.poliglota.findMany(); // Busca todos os poliglotas do banco
                for (const poliglota of poliglotas) {
                    const usuarioAtualizado = yield this.buscarPoliglota(poliglota.nome); // Busca os dados atualizados do Duolingo
                    if (usuarioAtualizado) {
                        let xpAlterado = 0;
                        // Verifica se houve alteração no XP
                        if (usuarioAtualizado.xp !== poliglota.xp) {
                            xpAlterado = usuarioAtualizado.xp - poliglota.xp; // Calcula a diferença de XP
                        }
                        // Atualiza dados do poliglota se necessário
                        const dadosAtualizados = {
                            idiomas: usuarioAtualizado.idiomas,
                            xp: usuarioAtualizado.xp,
                            ofensiva: usuarioAtualizado.ofensiva,
                            ultimaAtividade: usuarioAtualizado.ultimaAtividade,
                        };
                        // Se houver alguma alteração, atualiza o poliglota
                        yield prisma.poliglota.update({
                            where: { id: poliglota.id },
                            data: dadosAtualizados,
                        });
                        console.log(`Usuário ${poliglota.nome} atualizado!`);
                        // Se o XP foi alterado, registra no histórico
                        if (xpAlterado !== 0) {
                            yield this.registrarXP(poliglota.id, xpAlterado); // Registra a alteração no histórico de XP
                        }
                    }
                    else {
                        console.warn(`Usuário ${poliglota.nome} não encontrado no Duolingo.`);
                    }
                }
            }
            catch (error) {
                console.error("Erro ao atualizar poliglotas:", error);
            }
        });
    }
    extrairDados(json) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const user = json.users[0];
            return {
                nome: user.username,
                idiomas: user.courses.map((curso) => curso.title).join(", "),
                xp: user.totalXp,
                ofensiva: (_b = (_a = user.streakData) === null || _a === void 0 ? void 0 : _a.currentStreak) === null || _b === void 0 ? void 0 : _b.length,
                ultimaAtividade: ((_d = (_c = user.streakData) === null || _c === void 0 ? void 0 : _c.currentStreak) === null || _d === void 0 ? void 0 : _d.endDate)
                    ? new Date(user.streakData.currentStreak.endDate)
                    : null,
            };
        });
    }
    criar(nome, idiomas, xp, ofensiva, ultimaAtividade) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Criando poliglota com:", { nome, idiomas, xp, ofensiva, ultimaAtividade });
                // Criar o poliglota no banco
                const poliglota = yield prisma.poliglota.create({
                    data: { nome, idiomas, xp, ofensiva, ultimaAtividade }
                });
                // Registrar XP
                if (xp) {
                    yield this.registrarXP(poliglota.id, xp); // Registra o XP inicial
                }
                return poliglota;
            }
            catch (error) {
                if (error.code === 'P2002') { // Prisma retorna P2002 quando há violãção de unique
                    throw new Error("Usuário já existe!");
                }
                throw error;
            }
        });
    }
    listar() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.poliglota.findMany();
        });
    }
    editar(id, nome, idiomas, xp, ofensiva, ultimaAtividade) {
        return __awaiter(this, void 0, void 0, function* () {
            // Pegar o xp atual
            const poliglotaAntigo = yield prisma.poliglota.findUnique({
                where: { id },
            });
            if (!poliglotaAntigo) {
                throw new Error("Poliglota não encontrado");
            }
            // Se houve alterações no xp, registrar
            let xpAlterado = 0;
            if (xp && xp !== poliglotaAntigo.xp) {
                xpAlterado = xp - poliglotaAntigo.xp; // Diferença de xp
            }
            // Caso houve alteração  no XP, registrar
            if (xpAlterado !== 0) {
                yield this.registrarXP(id, xpAlterado);
            }
            // Atualiza os dados do poliglota
            return yield prisma.poliglota.update({
                where: { id },
                data: {
                    nome,
                    idiomas,
                    xp,
                    ofensiva,
                    ultimaAtividade
                },
            });
        });
    }
    remover(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.poliglota.delete({ where: { id } });
        });
    }
    registrarXP(poliglotaId, xpAlterado) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Registra a alteração de XP na tabela HistoricoXP
                yield prisma.historicoXP.create({
                    data: {
                        poliglotaId: poliglotaId,
                        xpAlterado: xpAlterado, // Quantos pontos de XP foram alterados
                    },
                });
            }
            catch (error) {
                console.error("Erro ao registrar XP:", error);
                throw new Error("Erro ao registrar XP.");
            }
        });
    }
    rankPorPeriodo(periodo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let startDate;
                const endDate = new Date(); // Data atual
                // Ajuste na definição do intervalo de datas
                if (periodo === 'diario') {
                    startDate = new Date();
                    startDate.setHours(0, 0, 0, 0); // Define o início do dia como meia-noite
                }
                else if (periodo === 'semanal') {
                    startDate = new Date();
                    startDate.setDate(endDate.getDate() - 7); // 7 dias atrás
                }
                else if (periodo === 'mensal') {
                    startDate = new Date();
                    startDate.setMonth(endDate.getMonth() - 1); // 1 mês atrás
                }
                else if (periodo === 'anual') {
                    startDate = new Date();
                    startDate.setFullYear(endDate.getFullYear() - 1); // 1 ano atrás
                    startDate.setMonth(0); // Início do ano
                    startDate.setDate(1); // Começo do ano
                }
                else {
                    throw new Error('Período inválido');
                }
                // Consultar o histórico de XP dos poliglotas dentro do período
                const ranking = yield prisma.historicoXP.findMany({
                    where: {
                        data: {
                            gte: startDate, // Data de início do período
                            lte: endDate, // Data final (hoje)
                        },
                    },
                    include: {
                        poliglota: true, // Inclui os dados do poliglota na consulta
                    },
                });
                // Verificar se há dados no histórico
                if (!ranking || ranking.length === 0) {
                    return []; // Caso não haja dados, retorna um array vazio
                }
                // Agregar os XP ganhos por poliglota
                const rankingAgregado = ranking.reduce((acc, historico) => {
                    const poliglotaId = historico.poliglota.id;
                    if (!acc[poliglotaId]) {
                        acc[poliglotaId] = { poliglota: historico.poliglota, xpTotal: 0 };
                    }
                    acc[poliglotaId].xpTotal += historico.xpAlterado; // Soma o XP alterado
                    return acc;
                }, {});
                // Ordenando os poliglotas pelo XP total, de forma decrescente
                const rankingOrdenado = Object.values(rankingAgregado).sort((a, b) => b.xpTotal - a.xpTotal);
                return rankingOrdenado;
            }
            catch (error) {
                console.error("Erro ao gerar ranking por período:", error);
                throw new Error("Erro ao gerar ranking");
            }
        });
    }
}
exports.default = new PoliglotasService();
