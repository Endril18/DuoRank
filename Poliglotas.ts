class Poliglota {
  id: number;
  nome: string;
  idiomas: string;
  xp: number;
  ofensiva: number;
  ultimaAtividade: Date;

  constructor(id: number, nome: string, idiomas: string, xp: number, ofensiva: number, ultimaAtividade: Date) {
    this.id = id;
    this.nome = nome;
    this.idiomas = "";
    this.xp = 0;
    this.ofensiva = 0;
    this.ultimaAtividade = new Date(0);
  }
}