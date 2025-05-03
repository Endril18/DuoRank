import { PrismaClient } from '@prisma/client';
import express from 'express';

const prisma = new PrismaClient();
const router = express.Router();

// Rota para obter o ranking
router.get('/', async (req, res) => {
  try {
    // Buscar os alunos ordenados por pontos (xp) de forma decrescente
    const ranking = await prisma.poliglota.findMany({
      orderBy: {
        xp: 'desc',  // Ordena pela pontuação de xp (do maior para o menor)
      },
      take: 10,  // Limita para os top 10 (pode ajustar conforme necessário)
    });
    res.json(ranking);  // Retorna o ranking como resposta
  } catch (error) {
    console.error('Erro ao buscar ranking:', error);
    res.status(500).json({ error: 'Erro ao buscar ranking' });
  } finally {
    await prisma.$disconnect();  // Fechar a conexão com o banco após a execução
  }
});

export default router;
