import {PrismaClient} from "@prisma/client"; //importar o client do prisma que vai lidar com o banco de dados
//import { api } from "../providers/api";
import axios from  "axios";

const prisma = new PrismaClient()

class PoliglotasService{

    async buscarPoliglota(username: string) {
        try {
            const url = `https://www.duolingo.com/2017-06-30/users?username=${username}`;
            const response = await axios.get(url, {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0' // Simula um navegador
                }
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar usuário:", error);
            throw new Error("Erro ao obter os dados do usuário");
        }

    }

    // //criando metodos para manipular os usuarios
    // async criar(dados: { nome: string; idiomas: string; xp?: number; ofensiva?: number; ultimaAtividade?: Date }) {
    //     return await prisma.poliglota.create({ data: dados });
    // }

    // async listar() {
    //     return await prisma.poliglota.findMany();
    // }

    // async editar(id: number, dados: Partial<{ nome: string; idiomas: string; xp: number; ofensiva: number; ultimaAtividade: Date }>) {
    //     return await prisma.poliglota.update({ where: { id }, data: dados });
    // }

    // async remover(id: number) {
    //     return await prisma.poliglota.delete({where: {id} });
    // }

}

export default new PoliglotasService();


