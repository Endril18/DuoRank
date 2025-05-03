import {PrismaClient, Poliglota } from "@prisma/client"; //importar o client do prisma que vai lidar com o banco de dados
import { DadosDuolingo } from "../types/poliglota";
import axios from  "axios";
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient()

class PoliglotasService{

    async buscarPoliglota(username: string): Promise<DadosDuolingo>{
        try {
            const url = `${process.env.BASE_ENDPOINT_URL}${username}`; // usar .env
            const response = await axios.get(url, {
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


    // 🔄 Atualizar dados de todos os usuários cadastrados
    async atualizarTodosPoliglotas() {
        try {
            const poliglotas = await prisma.poliglota.findMany(); // Busca todos do banco

            for (const poliglota of poliglotas) {
                const usuarioAtualizado = await this.buscarPoliglota(poliglota.nome);

                if (usuarioAtualizado) {
                    await prisma.poliglota.update({
                        where: { id: poliglota.id },
                        data: {
                            idiomas: usuarioAtualizado.idiomas, // Atualiza idiomas
                            xp: usuarioAtualizado.xp,
                            ofensiva: usuarioAtualizado.ofensiva,
                            ultimaAtividade: usuarioAtualizado.ultimaAtividade, // Atualiza última atividade
                        },
                    });

                    console.log(`✅ Usuário ${poliglota.nome} atualizado!`);
                } else {
                    console.warn(`⚠️ Usuário ${poliglota.nome} não encontrado no Duolingo.`);
                }
            }
        } catch (error) {
            console.error("❌ Erro ao atualizar poliglotas:", error);
        }
    }

    async extrairDados(json: any): Promise<DadosDuolingo> {
        //console.log("Dados recebidos da API:", JSON.stringify(json, null, 2));
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

    async criar(nome: string, idiomas: string, xp?: number, ofensiva?: number, ultimaAtividade?: Date | null): Promise<Poliglota> {
            try {
                console.log("Criando poliglota com:", { nome, idiomas, xp, ofensiva, ultimaAtividade });

                // Criar o poliglota no banco
                const poliglota = await prisma.poliglota.create({
                     data: { nome, idiomas, xp, ofensiva, ultimaAtividade}
                });

                // Registrar XP
                if (xp) {
                    await this.registrarXP(poliglota.id, xp);  // Registra o XP inicial
                }


                return poliglota;

        } catch (error: any) {
            if (error.code === 'P2002') { // Prisma retorna P2002 quando há violãção de unique
                throw new Error("Usuário já existe!");
            }
            throw error;
        }
    }

    async listar(): Promise<Poliglota[]> {
        return await prisma.poliglota.findMany();
    }

    async editar(id: number, nome: string, idiomas: string, xp?: number, ofensiva?: number, ultimaAtividade?: Date) {
        return await prisma.poliglota.update({
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
        return await prisma.poliglota.delete({where: {id} });
    }

    async registrarXP(poliglotaId: number, xpAlterado: number) {
        try {
            // Registra a alteração de XP na tabela HistoricoXP
            await prisma.historicoXP.create({
                data: {
                    poliglotaId: poliglotaId,
                    xpAlterado: xpAlterado,  // Quantos pontos de XP foram alterados
                },
            });
        } catch (error) {
            console.error("Erro ao registrar XP:", error);
            throw new Error("Erro ao registrar XP.");
        }
    }
}

export default new PoliglotasService();


