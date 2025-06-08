import 'dotenv/config'; // Deve ser a PRIMEIRA linha do arquivo
import PoliglotasService from './backend/src/services/PoliglotasService';

console.log('Verificando variáveis:');
console.log('DATABASE_URL:', process.env.DATABASE_URL); // Deve mostrar sua URL

async function testAtualizarTodos() {
  try {
    console.log("Iniciando teste...");
    await PoliglotasService.atualizarTodosPoliglotas();
    console.log("Teste concluído!");
  } catch (error) {
    console.error("Erro:", error);
  } finally {
    process.exit();
  }
}

testAtualizarTodos();