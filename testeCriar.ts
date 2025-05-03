import readline from 'readline';
import axios from 'axios';
import PoliglotaService from './backend/src/services/PoliglotasService';
import PoliglotaController from './backend/src/controllers/PoliglotasController';
import dotenv from 'dotenv';

dotenv.config();

// Configurar o readline para interagir com o usuário no terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Função para pedir o nome de usuário ao terminal e realizar o fluxo
const pedirUsuario = () => {
  rl.question('Digite o nome de usuário que você quer buscar: (ou "sair" se vce deseja encerrar)', async (username) => {
    if (username.toLowerCase() === 'sair') {
      console.log('Encerrando...');
      rl.close();
      return;
    }

    try {
      // Chama a função do PoliglotaService para buscar os dados
      const usuario = await PoliglotaService.buscarPoliglota(username);
      if (!usuario) {
        console.log('Usuário não encontrado!');
        return pedirUsuario(); // Pergunta novamente
      }

      // Passa os dados para o req.body
      const req = { body: { username: usuario.nome, idiomas: usuario.idiomas, xp: usuario.xp, ofensiva: usuario.ofensiva, ultimaAtividade: usuario.ultimaAtividade }};
      const res = {
        status: (statusCode) => {
          //console.log('Status:', statusCode);
          return res;
        },
        json: (data) => {
          //console.log('Data:', data);
        },
      };

      // Chama o controller para adicionar o poliglota
      await PoliglotaController.criar(req, res);

      console.log('Usuário adicionado ao banco com sucesso!');
    } catch (error) {
      console.log('Erro ao buscar ou adicionar o usuário:', error.message);
    } finally {
      pedirUsuario(); // Pergunta novamente
    }
  });
};

// Inicia o loop de perguntas
pedirUsuario();
