class Usuário {
  nome: string;
  cursos: string[];
  xp: number;
  ofensiva: number;
  dataUltimaAtividade: Date;

  constructor(nome: string, cursos: string[], xp: number, ofensiva: number, dataUltimaArividade: Date) {
    this.nome = nome;
    this.cursos = [];
    this.xp = 0;
    this.ofensiva = 0;
    this.dataUltimaAtividade = new Date(0);
  }
}