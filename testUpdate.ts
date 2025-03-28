import readline from 'readline';
import axios from 'axios';
import PoliglotaService from './backend/src/services/PoliglotasService';
import PoliglotaController from './backend/src/controllers/PoliglotasController';
import dotenv from 'dotenv';

dotenv.config();


console.log("Atualizando...");

PoliglotaService.atualizarTodosPoliglotas()
  .then(() => console.log("✅ Atualização concluída!"))
  .catch((err) => console.error("❌ Erro ao atualizar:", err));
