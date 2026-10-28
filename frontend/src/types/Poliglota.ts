export interface Poliglota {
  id: number;
  nome: string;
  idiomas: string;
  xp: number;
  ofensiva: number;
  ultimaAtividade: string | null;
}

export type StatusAtividade = 'hoje' | 'ontem' | 'atrasada' | 'sem-registro' | 'futura';

export interface PoliglotaRanqueado extends Poliglota {
  rank: number;
  statusAtividade: StatusAtividade;
  diasDesdeAtividade: number | null;
}

export interface ResumoRanking {
  totalPoliglotas: number;
  estudaramHoje: number;
  pendentesHoje: number;
  percentualAtividadeHoje: number;
  maiorOfensiva: number;
}

export interface RankingResponse {
  dataReferencia: string;
  timeZone: string;
  resumo: ResumoRanking;
  poliglotas: PoliglotaRanqueado[];
}

export function isPoliglota(value: unknown): value is Poliglota {
  if (typeof value !== 'object' || value === null) return false;

  const poliglota = value as Record<string, unknown>;
  return (
    typeof poliglota.id === 'number' &&
    typeof poliglota.nome === 'string' &&
    typeof poliglota.idiomas === 'string' &&
    typeof poliglota.xp === 'number' &&
    typeof poliglota.ofensiva === 'number' &&
    (typeof poliglota.ultimaAtividade === 'string' || poliglota.ultimaAtividade === null)
  );
}

function isStatusAtividade(value: unknown): value is StatusAtividade {
  return value === 'hoje' || value === 'ontem' || value === 'atrasada' || value === 'sem-registro' || value === 'futura';
}

function isPoliglotaRanqueado(value: unknown): value is PoliglotaRanqueado {
  if (!isPoliglota(value)) return false;

  const poliglota = value as Poliglota & Record<string, unknown>;
  return (
    Number.isInteger(poliglota.rank) &&
    isStatusAtividade(poliglota.statusAtividade) &&
    (typeof poliglota.diasDesdeAtividade === 'number' || poliglota.diasDesdeAtividade === null)
  );
}

export function isRankingResponse(value: unknown): value is RankingResponse {
  if (typeof value !== 'object' || value === null) return false;

  const ranking = value as Record<string, unknown>;
  if (typeof ranking.resumo !== 'object' || ranking.resumo === null || !Array.isArray(ranking.poliglotas)) {
    return false;
  }

  const resumo = ranking.resumo as Record<string, unknown>;
  return (
    typeof ranking.dataReferencia === 'string' &&
    typeof ranking.timeZone === 'string' &&
    Number.isInteger(resumo.totalPoliglotas) &&
    Number.isInteger(resumo.estudaramHoje) &&
    Number.isInteger(resumo.pendentesHoje) &&
    Number.isInteger(resumo.percentualAtividadeHoje) &&
    Number.isInteger(resumo.maiorOfensiva) &&
    ranking.poliglotas.every(isPoliglotaRanqueado)
  );
}

export function formatarDataAtividade(ultimaAtividade: string | null): string {
  if (!ultimaAtividade) return 'Sem atividade registrada';

  const data = ultimaAtividade.slice(0, 10);
  const [ano, mes, dia] = data.split('-').map(Number);
  const dataLocal = new Date(ano, mes - 1, dia);
  if (Number.isNaN(dataLocal.getTime())) return 'Sem atividade registrada';

  return `Atividade em ${new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' }).format(dataLocal)}`;
}