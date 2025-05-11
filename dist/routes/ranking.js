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
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
// Rota para obter o ranking
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Definir o intervalo de datas (semanal, mensal, anual)
        const { periodo } = req.query; // Recebe 'semanal', 'mensal', ou 'anual' através da query string ()
        let startDate;
        const endDate = new Date(); // Data atual
        if (periodo === 'semanal') {
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
        }
        else {
            startDate = new Date(0); // Inicia desde a data mais antiga, caso não tenha filtro
        }
        // Buscar o histórico de XP por poliglota dentro do período definido
        const ranking = yield prisma.historicoXP.findMany({
            where: {
                data: {
                    gte: startDate, // Data de início do período
                    lte: endDate, // Data final (hoje)
                },
            },
            include: {
                poliglota: true, // Inclui os dados do poliglota (nome, idiomas, etc.)
            },
        });
        // Agregar os dados por poliglota, somando o XP alterado
        const rankingAgregado = ranking.reduce((acc, historico) => {
            const poliglotaId = historico.poliglota.id;
            if (!acc[poliglotaId]) {
                acc[poliglotaId] = { poliglota: historico.poliglota, xpTotal: 0 };
            }
            acc[poliglotaId].xpTotal += historico.xpAlterado;
            return acc;
        }, {});
        // Ordenando os poliglotas pelo XP total
        const rankingOrdenado = Object.values(rankingAgregado).sort((a, b) => b.xpTotal - a.xpTotal);
        // Retorna o ranking ordenado
        res.json(rankingOrdenado);
    }
    catch (error) {
        console.error('Erro ao buscar ranking:', error);
        res.status(500).json({ error: 'Erro ao buscar ranking' });
    }
    finally {
        yield prisma.$disconnect(); // Fechar a conexão com o banco após a execução
    }
}));
exports.default = router;
