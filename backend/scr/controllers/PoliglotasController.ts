import { Request, Response } from "express"; //importa a biblioteca para realizar as requisicoes http
//import poliglota service que possui os metodos

class PoliglotasController{
    //funcoes para lidar com as requisicoes http do sistema
    async criar(req: Request, res: Response){}
    async listar(req: Request, res: Response){}
    async editar(req: Request, res: Response){}
    async remover(req: Request, res: Response){}
    //usar metodo de buscar participante na api do duolingo aqui
}

export default new PoliglotasController();
//cria uma nova instancia da classe e exporta para poder usar em outras classes