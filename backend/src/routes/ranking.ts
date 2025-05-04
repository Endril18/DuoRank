import { PrismaClient } from '@prisma/client';
import express from 'express';

const prisma = new PrismaClient();
const router = express.Router();

// Rota para obter o ranking
router.get('/', async (req, res) => {
  try {
    // Definir o intervalo de datas (semanal, mensal, anual)
    const { periodo } = req.query; // Recebe 'semanal', 'mensal', ou 'anual' através da query string ()

    let startDate: Date;
    const endDate = new Date(); // Data atual

    if (periodo === 'semanal') {
      startDate = new Date();
      startDate.setDate(endDate.getDate() - 7); // 7 dias atrás
    } else if (periodo === 'mensal') {
      startDate = new Date();
      startDate.setMonth(endDate.getMonth() - 1); // 1 mês atrás
    } else if (periodo === 'anual') {
      startDate = new Date();
      startDate.setFullYear(endDate.getFullYear() - 1); // 1 ano atrás
    } else {
      startDate = new Date(0); // Inicia desde a data mais antiga, caso não tenha filtro
    }

    // Buscar o histórico de XP por poliglota dentro do período definido
    const ranking = await prisma.historicoXP.findMany({
      where: {
        data: {
          gte: startDate, // Data de início do período
          lte: endDate,   // Data final (hoje)
        },
      },
      include: {
        poliglota: true, // Inclui os dados do poliglota (nome, idiomas, etc.)
      },
    });

    // Agregar os dados por poliglota, somando o XP alterado
    const rankingAgregado = ranking.reduce((acc: any, historico) => {
      const poliglotaId = historico.poliglota.id;
      if (!acc[poliglotaId]) {
        acc[poliglotaId] = { poliglota: historico.poliglota, xpTotal: 0 };
      }
      acc[poliglotaId].xpTotal += historico.xpAlterado;
      return acc;
    }, {});

    // Ordenando os poliglotas pelo XP total
    const rankingOrdenado = Object.values(rankingAgregado).sort((a: any, b: any) => b.xpTotal - a.xpTotal);

    // Retorna o ranking ordenado
    res.json(rankingOrdenado);
  } catch (error) {
    console.error('Erro ao buscar ranking:', error);
    res.status(500).json({ error: 'Erro ao buscar ranking' });
  } finally {
    await prisma.$disconnect();  // Fechar a conexão com o banco após a execução
  }
});

export default router;
