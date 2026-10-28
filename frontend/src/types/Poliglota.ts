export interface Poliglota {
  id: number;
  nome: string;
  idiomas: string;
  xp: number;
  ofensiva: number;
  ultimaAtividade: string | null;
}

export type StatusAtividade = 'hoje' | 'ontem' | 'atrasada' | 'sem-registro';

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

export function getStatusAtividade(ultimaAtividade: string | null, hoje = new Date()): StatusAtividade {
  if (!ultimaAtividade) return 'sem-registro';

  const data = ultimaAtividade.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return 'sem-registro';

  const [ano, mes, dia] = data.split('-').map(Number);
  const [anoHoje, mesHoje, diaHoje] = [
    hoje.getFullYear(),
    hoje.getMonth() + 1,
    hoje.getDate(),
  ];
  const diaAtividade = Date.UTC(ano, mes - 1, dia);
  const diaAtual = Date.UTC(anoHoje, mesHoje - 1, diaHoje);
  const diasDesdeAtividade = Math.floor((diaAtual - diaAtividade) / 86_400_000);

  if (diasDesdeAtividade <= 0) return 'hoje';
  if (diasDesdeAtividade === 1) return 'ontem';
  return 'atrasada';
}

export function formatarDataAtividade(ultimaAtividade: string | null): string {
  if (!ultimaAtividade) return 'Sem atividade registrada';

  const data = ultimaAtividade.slice(0, 10);
  const [ano, mes, dia] = data.split('-').map(Number);
  const dataLocal = new Date(ano, mes - 1, dia);
  if (Number.isNaN(dataLocal.getTime())) return 'Sem atividade registrada';

  return `Atividade em ${new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' }).format(dataLocal)}`;
}