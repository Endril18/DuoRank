import { differenceInCalendarDays } from "date-fns";

export const calcularStatusOfensiva = (ultimaAtividade: Date | string | null): string => {
  console.log('[1] Iniciando cálculo - ultimaAtividade:', ultimaAtividade);

  if (!ultimaAtividade) {
    console.log('[2] Retornando "💀" porque ultimaAtividade é null/undefined');
    return "💀";
  }

  const dataAtividade = new Date(ultimaAtividade);
  if (isNaN(dataAtividade.getTime())) {
    console.error("[Erro] ultimaAtividade inválida:", ultimaAtividade);
    return "Data inválida ❌";
  }

  const hoje = new Date();
  const diffDias = differenceInCalendarDays(hoje, dataAtividade) - 1;

  console.log(`[3] Data da atividade ao ser convertida para tipo Date: ${dataAtividade}`);
  console.log(`[4] Diferença em dias (sem fuso): ${diffDias}`);

  if (diffDias === 0) return "Já fez 🔥";
  if (diffDias === 1) return "Fez ontem";
  if (diffDias < 0) return "Data futura ❌";

  return `Há ${diffDias} dias`;
};
