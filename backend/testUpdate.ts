import readline from 'readline';
import axios from 'axios';
import PoliglotaService from './src/services/PoliglotasService';
import PoliglotaController from './src/controllers/PoliglotasController';
import dotenv from 'dotenv';

dotenv.config();


console.log("Atualizando...");

PoliglotaService.atualizarTodosPoliglotas()
  .then(() => console.log("✅ Atualização concluída!"))
  .catch((err) => console.error("❌ Erro ao atualizar:", err));
