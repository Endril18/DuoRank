export const calcularStatusOfensiva = (ultimaAtividade: Date | null): string => {
  if (!ultimaAtividade) {
    return "💀";
  }

  const hoje = new Date();
  const diasDiferenca = Math.floor((hoje.getTime() - new Date(ultimaAtividade).getTime()) / (1000 * 3600 * 24));

  if (diasDiferenca === 0) {
    return "Já fez 🔥"; // A ofensiva está ativa hoje
  }

  if (diasDiferenca === 1) {
    return "Fez ontem"; // A ofensiva parou ontem
  }

  return `Há ${diasDiferenca} dia(s)`; // A ofensiva está parada há X dias
};
