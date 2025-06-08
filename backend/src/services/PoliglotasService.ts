import { PrismaClient } from "@prisma/client"; //importar o client do prisma que vai lidar com o banco de dados
import { DadosDuolingo } from "../types/poliglota";
import axios from  "axios";
import dotenv from 'dotenv';

interface PoliglotaCreateParams {
    nome: string;
    idiomas: string;
    xp?: number;
    ofensiva?: number;
    ultimaAtividade?: Date | null;
}

// Configuração do dotenv para carregar variáveis de ambiente
dotenv.config();
class PoliglotasService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async buscarPoliglota(username: string): Promise<DadosDuolingo>{
        try {
            const url = `${process.env.DUO_ENDPOINT_URL}${username}`; // usar .env
            const response = await axios.get( url, {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0' // Simula um navegador
                }
            });
            return this.extrairDados(response.data);
        } catch (error) {
            console.error("Erro ao buscar usuário:", error);
            throw new Error("Erro ao obter os dados do usuário");
        }
    }


    // Atualizar dados de todos os usuários cadastrados
    async atualizarTodosPoliglotas() {
        try {
            const poliglotas = await this.prisma.poliglota.findMany(); // Busca todos os poliglotas do banco

            for (const poliglota of poliglotas) {
                const usuarioAtualizado = await this.buscarPoliglota(poliglota.nome); // Busca os dados atualizados do Duolingo

                if (usuarioAtualizado) {
                    // Atualiza dados do poliglota se necessário
                    const dadosAtualizados = {
                        idiomas: usuarioAtualizado.idiomas,
                        xp: usuarioAtualizado.xp,
                        ofensiva: usuarioAtualizado.ofensiva,
                        ultimaAtividade: usuarioAtualizado.ultimaAtividade,
                    };

                    // Se houver alguma alteração, atualiza o poliglota
                    await this.prisma.poliglota.update({
                        where: { id: poliglota.id },
                        data: dadosAtualizados,
                    });

                    console.log(`Usuário ${poliglota.nome} atualizado!`);

                } else {
                    console.warn(`Usuário ${poliglota.nome} não encontrado no Duolingo.`);
                }
            }
        } catch (error) {
            console.error("Erro ao atualizar poliglotas:", error);
        }
    }

    async extrairDados(json: any): Promise<DadosDuolingo> {
        const user = json.users[0];
        return {
            nome: user.username,
            idiomas: user.courses.map((curso: any) => curso.title).join(", "),
            xp: user.totalXp,
            ofensiva: user.streakData?.currentStreak?.length,
            ultimaAtividade: user.streakData?.currentStreak?.endDate
            ? new Date(user.streakData.currentStreak.endDate)
            : null,
        };
    }

    async criar(nome: string, idiomas: string, xp?: number, ofensiva?: number, ultimaAtividade?: Date | null) {
            try {
                return await this.prisma.poliglota.create({
                    data: { nome, idiomas, xp, ofensiva, ultimaAtividade }
                });
                // Log para depuração
                console.log("Criando poliglota com:", { nome, idiomas, xp, ofensiva, ultimaAtividade });
            } catch (error: any) {
                if (error.code === 'P2002') {
                    throw new Error("Usuário já existe!");
                }
                throw error;
            }
    }

    async listar() {
        return await this.prisma.poliglota.findMany();
    }

    async editar(id: number, nome: string, idiomas: string, xp?: number, ofensiva?: number, ultimaAtividade?: Date) {
        // Pegar o xp atual
        const poliglotaAntigo = await this.prisma.poliglota.findUnique({
            where: { id },
        })

        if (!poliglotaAntigo) {
            throw new Error("Poliglota não encontrado");
        }

        // Atualiza os dados do poliglota
        return await this.prisma.poliglota.update({
            where: { id },
            data: {
                nome,
                idiomas,
                xp,
                ofensiva,
                ultimaAtividade
            },
        });
    }

    async remover(id: number) {
        return await this.prisma.poliglota.delete({where: {id} });
    }

    async desconectar() {
        await this.prisma.$disconnect();
    }
}

export default PoliglotasService;


