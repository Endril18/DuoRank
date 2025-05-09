import readline from "readline";
import dotenv from "dotenv";
import PoliglotaController from "./src/controllers/PoliglotasController";
import { Request, Response } from "express";

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

// Função para testar o método `listar()`
const testarListar = async () => {
  try {
    const req = { query: {} } as Request; // Simulando um request sem parâmetros
    const res = createMockResponse(); // Simulando um response

    console.log("\n🔍 Buscando lista de poliglotas...");
    await PoliglotaController.listar(req, res);
  } catch (error) {
    console.error("Erro ao listar os poliglotas:", error.message);
  } finally {
    rl.close();
  }
};

// Inicia o teste do método listar
testarListar();
