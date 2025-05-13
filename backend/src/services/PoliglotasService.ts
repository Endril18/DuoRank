import { PrismaClient } from "@prisma/client"; //importar o client do prisma que vai lidar com o banco de dados
import { DadosDuolingo } from "../types/poliglota";
import axios from  "axios";
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient()

class PoliglotasService{

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
            const poliglotas = await prisma.poliglota.findMany(); // Busca todos os poliglotas do banco

            for (const poliglota of poliglotas) {
                const usuarioAtualizado = await this.buscarPoliglota(poliglota.nome); // Busca os dados atualizados do Duolingo

                if (usuarioAtualizado) {
                    let xpAlterado = 0;

                    // Verifica se houve alteração no XP
                    if (usuarioAtualizado.xp !== poliglota.xp) {
                        xpAlterado = usuarioAtualizado.xp - poliglota.xp; // Calcula a diferença de XP
                    }

                    // Atualiza dados do poliglota se necessário
                    const dadosAtualizados = {
                        idiomas: usuarioAtualizado.idiomas,
                        xp: usuarioAtualizado.xp,
                        ofensiva: usuarioAtualizado.ofensiva,
                        ultimaAtividade: usuarioAtualizado.ultimaAtividade,
                    };

                    // Se houver alguma alteração, atualiza o poliglota
                    await prisma.poliglota.update({
                        where: { id: poliglota.id },
                        data: dadosAtualizados,
                    });

                    console.log(`Usuário ${poliglota.nome} atualizado!`);

                    // Se o XP foi alterado, registra no histórico
                    if (xpAlterado !== 0) {
                        await this.registrarXP(poliglota.id, xpAlterado); // Registra a alteração no histórico de XP
                    }

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

    async listar() {
        return await prisma.poliglota.findMany();
    }

    async editar(id: number, nome: string, idiomas: string, xp?: number, ofensiva?: number, ultimaAtividade?: Date) {
        // Pegar o xp atual
        const poliglotaAntigo = await prisma.poliglota.findUnique({
            where: { id },
        })

        if (!poliglotaAntigo) {
            throw new Error("Poliglota não encontrado");
        }

        // Se houve alterações no xp, registrar
        let xpAlterado = 0;
        if (xp && xp !== poliglotaAntigo.xp) {
            xpAlterado = xp - poliglotaAntigo.xp; // Diferença de xp
        }

        // Caso houve alteração  no XP, registrar
        if (xpAlterado !== 0) {
            await this.registrarXP(id, xpAlterado)
        }

        // Atualiza os dados do poliglota
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

    async rankPorPeriodo(periodo: 'diario' | 'semanal' | 'mensal' | 'anual') {
        try {
          let startDate: Date;
          const endDate = new Date(); // Data atual

          // Ajuste na definição do intervalo de datas
          if (periodo === 'diario') {
            startDate = new Date();
            startDate.setHours(0, 0, 0, 0);  // Define o início do dia como meia-noite
          } else if (periodo === 'semanal') {
            startDate = new Date();
            startDate.setDate(endDate.getDate() - 7);  // 7 dias atrás
          } else if (periodo === 'mensal') {
            startDate = new Date();
            startDate.setMonth(endDate.getMonth() - 1);  // 1 mês atrás
          } else if (periodo === 'anual') {
            startDate = new Date();
            startDate.setFullYear(endDate.getFullYear() - 1);  // 1 ano atrás
            startDate.setMonth(0);  // Início do ano
            startDate.setDate(1);  // Começo do ano
          } else {
            throw new Error('Período inválido');
          }

          // Consultar o histórico de XP dos poliglotas dentro do período
          const ranking = await prisma.historicoXP.findMany({
            where: {
              data: {
                gte: startDate, // Data de início do período
                lte: endDate,   // Data final (hoje)
              },
            },
            include: {
              poliglota: true, // Inclui os dados do poliglota na consulta
            },
          });

          // Verificar se há dados no histórico
          if (!ranking || ranking.length === 0) {
            return [];  // Caso não haja dados, retorna um array vazio
          }

          // Agregar os XP ganhos por poliglota
          const rankingAgregado = ranking.reduce((acc: any, historico) => {
            const poliglotaId = historico.poliglota.id;
            if (!acc[poliglotaId]) {
              acc[poliglotaId] = { poliglota: historico.poliglota, xpTotal: 0 };
            }
            acc[poliglotaId].xpTotal += historico.xpAlterado;  // Soma o XP alterado
            return acc;
          }, {});

          // Ordenando os poliglotas pelo XP total, de forma decrescente
          const rankingOrdenado = Object.values(rankingAgregado).sort((a: any, b: any) => b.xpTotal - a.xpTotal);

          return rankingOrdenado;
        } catch (error) {
          console.error("Erro ao gerar ranking por período:", error);
          throw new Error("Erro ao gerar ranking");
        }
      }

}

export default new PoliglotasService();


