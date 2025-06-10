
// Definindo o tipo Poliglota manualmente, para evitar dependências externas,
// garantir que o código funcione mesmo sem o import direto do Prisma

export type Poliglota = {
  id: number;
  nome: string;
  idiomas: string;
  xp: number;
  ofensiva: number;
  ultimaAtividade: Date | null;
};

// DadosDuolingo omitindo o 'id' do tipo Poliglota
export type DadosDuolingo = Omit<Poliglota, 'id'>;
