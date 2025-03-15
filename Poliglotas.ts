class Poliglota {
  id: number;
  nome: string;
  idiomas: string;
  xp: number;
  ofensiva: number;
  dataUltimaAtividade: Date;

  constructor(id: number, nome: string, idiomas: string, xp: number, ofensiva: number, dataUltimaAtividade: Date) {
    this.id = id;
    this.nome = nome;
    this.idiomas = "";
    this.xp = 0;
    this.ofensiva = 0;
    this.dataUltimaAtividade = new Date(0);
  }
}