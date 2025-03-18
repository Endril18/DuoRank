import PoliglotasService from "./backend/src/services/PoliglotasService"; // Importação correta // Ajuste o caminho conforme necessário



async function testar() {
    try {
        const data = await PoliglotasService.buscarPoliglota("Thamy0137");
        console.log(data);

        // Acessando os dados do streakData
        const streakData = data.users[0].streakData.currentStreak;

        // Exibindo as informações do streakData
        console.log("Start Date:", streakData.startDate);
        console.log("Streak Length:", streakData.length);
        console.log("End Date:", streakData.endDate);

    } catch (error) {
        console.error("Erro no teste:", error);
    }
}

testar();

