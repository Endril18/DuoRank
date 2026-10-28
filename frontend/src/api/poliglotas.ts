import { isRankingResponse, type RankingResponse } from '../types/Poliglota';

const API_URL = (
  import.meta.env.DEV
    ? '/api/poliglotas'
    : import.meta.env.VITE_API_BACKEND || '/api/poliglotas'
).replace(/\/$/, '');

async function request(url: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Não foi possível conectar à API. Verifique se o backend está em execução e se o CORS permite esta origem.');
    }

    throw error;
  }
}

async function obterErro(response: Response, mensagemPadrao: string): Promise<Error> {
  const data: unknown = await response.json().catch(() => null);
  if (typeof data === 'object' && data !== null) {
    const body = data as Record<string, unknown>;
    const mensagem = body.error ?? body.erro ?? body.message;
    if (typeof mensagem === 'string') return new Error(mensagem);
  }

  return new Error(mensagemPadrao);
}

export async function buscarRanking(): Promise<RankingResponse> {
  const response = await request(`${API_URL}/ranking`);
  if (!response.ok) {
    throw await obterErro(response, 'Não foi possível carregar o ranking. Verifique se a API está disponível.');
  }

  const data: unknown = await response.json();
  if (!isRankingResponse(data)) {
    throw new Error('A resposta do ranking tem um formato inválido.');
  }

  return data;
}

export async function adicionarParticipante(username: string): Promise<void> {
  const response = await request(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });

  if (!response.ok) {
    throw await obterErro(response, 'Não foi possível adicionar esse participante.');
  }
}

export async function atualizarParticipantes(): Promise<void> {
  const response = await request(`${API_URL}/atualizar-todos`, { method: 'POST' });
  if (!response.ok) {
    throw await obterErro(response, 'Não foi possível atualizar as ofensivas. Tente novamente.');
  }
}
