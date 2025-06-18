export interface Poliglota {
  id: number;
  nome: string;
  idiomas: string;
  xp: number;
  ofensiva: number;
  ultimaAtividade: Date | null; // Pode ser null ou uma string, ou até um tipo Date, dependendo da estrutura que você recebe da API
}