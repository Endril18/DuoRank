import readline from 'readline';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Configurar o readline para interagir com o usuário no terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Função para pedir o nome de usuário ao terminal e realizar o fluxo
const pedirUsuario = () => {
  rl.question('Digite o nome de usuário que você quer buscar: (ou "sair" se deseja encerrar)', async (username) => {
    if (username.toLowerCase() === 'sair') {
      console.log('Encerrando...');
      rl.close();
      return;
    }

    try {
      // Fazer a chamada HTTP para o backend no Railway
      const url = `${process.env.BASE_ENDPOINT_URL}${username}`; // usar .env
      const response = await axios.get(url, {
        headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0' // Simula um navegador
        }
      });
      const usuario = response.data;

      if (!usuario) {
        console.log('Usuário não encontrado!');
        return pedirUsuario(); // Pergunta novamente
      }

      console.log('Usuário encontrado:', usuario);

      // Se necessário, você pode adicionar o poliglota ao banco
      // Exemplo: chamando uma rota POST para adicionar o poliglota
      const addResponse = await axios.post(url, {
        username: usuario.nome,
        idiomas: usuario.idiomas,
        xp: usuario.xp,
        ofensiva: usuario.ofensiva,
        ultimaAtividade: usuario.ultimaAtividade
      });

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
