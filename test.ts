import PoliglotasService from "./backend/src/services/PoliglotasService"; // Importação correta // Ajuste o caminho conforme necessário



async function testar() {
    try {
        const data = await PoliglotasService.buscarPoliglota("Thamy0137");
        console.log(data);
    } catch (error) {
        console.error("Erro no teste:", error);
    }
}

testar();

