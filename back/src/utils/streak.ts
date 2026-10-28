export type StatusAtividade = 'hoje' | 'ontem' | 'atrasada' | 'sem-registro' | 'futura';

export interface AtividadeDiaria {
    statusAtividade: StatusAtividade;
    diasDesdeAtividade: number | null;
}

function dataEmFusoHorario(date: Date, timeZone: string): string {
    const partes = new Intl.DateTimeFormat('en-CA', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(date);
    const valores = Object.fromEntries(partes.map(({ type, value }) => [type, value]));

    return `${valores.year}-${valores.month}-${valores.day}`;
}

function diferencaEmDias(dataAnterior: string, dataAtual: string): number {
    const [anoAnterior, mesAnterior, diaAnterior] = dataAnterior.split('-').map(Number);
    const [anoAtual, mesAtual, diaAtual] = dataAtual.split('-').map(Number);
    const instanteAnterior = Date.UTC(anoAnterior, mesAnterior - 1, diaAnterior);
    const instanteAtual = Date.UTC(anoAtual, mesAtual - 1, diaAtual);

    return Math.round((instanteAtual - instanteAnterior) / 86_400_000);
}

export function obterAtividadeDiaria(
    ultimaAtividade: Date | null,
    agora = new Date(),
    timeZone = process.env.APP_TIME_ZONE || 'America/Sao_Paulo',
): AtividadeDiaria {
    if (!ultimaAtividade || Number.isNaN(ultimaAtividade.getTime())) {
        return { statusAtividade: 'sem-registro', diasDesdeAtividade: null };
    }

    const dataAtividade = ultimaAtividade.toISOString().slice(0, 10);
    const dataAtual = dataEmFusoHorario(agora, timeZone);
    const diasDesdeAtividade = diferencaEmDias(dataAtividade, dataAtual);

    if (diasDesdeAtividade < 0) {
        return { statusAtividade: 'futura', diasDesdeAtividade };
    }
    if (diasDesdeAtividade === 0) {
        return { statusAtividade: 'hoje', diasDesdeAtividade };
    }
    if (diasDesdeAtividade === 1) {
        return { statusAtividade: 'ontem', diasDesdeAtividade };
    }

    return { statusAtividade: 'atrasada', diasDesdeAtividade };
}

export function obterDataAtual(agora = new Date(), timeZone = process.env.APP_TIME_ZONE || 'America/Sao_Paulo'): string {
    return dataEmFusoHorario(agora, timeZone);
}
