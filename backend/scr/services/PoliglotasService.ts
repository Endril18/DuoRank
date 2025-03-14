import prisma from "../../prisma/client"; //importar o client do prisma que vai lidar com o banco de dados

class PoliglotasServices{

    //criando metodos para manipular os usuarios
    async criar(: Estado): Promise<> {
        return await prisma..create
    }

    async listar(): Promise<> {
        return await prisma..findMany
    }
    async editar() {
        return await prisma..update
    }


    async remover() {
        return await prisma..delete
    }
    //adicionar metodo para buscar participante na api do duolingo

}
export default new PoliglotasServices();