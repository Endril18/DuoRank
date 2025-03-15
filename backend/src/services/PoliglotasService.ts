import {PrismaClient} from "@prisma/client"; //importar o client do prisma que vai lidar com o banco de dados

const prisma = new PrismaClient()

class PoliglotasServices{

    //criando metodos para manipular os usuarios
    async criar(dados: { nome: string; idiomas: string; xp?: number; ofensiva?: number; ultimaAtividade?: Date }) {
        return await prisma.poliglota.create({ data: dados });
    }

    async listar() {
        return await prisma.poliglota.findMany();
    }

    async editar(id: number, dados: Partial<{ nome: string; idiomas: string; xp: number; ofensiva: number; ultimaAtividade: Date }>) {
        return await prisma.poliglota.update({ where: { id }, data: dados });
    }

    async remover(id: number) {
        return await prisma.poliglota.delete({where: {id} });
    }

}

export default new PoliglotasServices();


