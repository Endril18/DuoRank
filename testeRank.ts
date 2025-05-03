import readline from 'readline';
import dotenv from 'dotenv';
import PoliglotaController from './backend/src/controllers/PoliglotasController';
import { Request, Response } from 'express';

dotenv.config();

// Configurar o readline para interagir com o usuário no terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Criar um mock de Response (para simular a resposta do Express)
const createMockResponse = () => {
  const res: Partial<Response> = {
    status: function (statusCode: number) {
      console.log("Status:", statusCode);
      return this;
    },
    json: function (data: any) {
      console.log("Resposta JSON:", JSON.stringify(data, null, 2));
    }
  };
  return res as Response;
};

// Função para testar o método `rank()`
const testarRank = async () => {
  rl.question('Escolha o período (diario, semanal, anual): ', async (periodo) => {
    try {
      const req = { query: { periodo } } as Request; // Simulando o request com o parâmetro "periodo"
      const res = createMockResponse(); // Simulando o response

      console.log(`\n🔍 Buscando ranking para o período: ${periodo}...`);
      await PoliglotaController.rank(req, res);  // Chama o método de ranking do controlador
    } catch (error) {
      console.error("Erro ao buscar ranking:", error.message);
    } finally {
      rl.close();
    }
  });
};

// Inicia o teste do método rank
testarRank();
