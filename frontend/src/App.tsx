import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import PoliglotaItem from './PoliglotaItem';
import { adicionarParticipante, atualizarParticipantes, buscarRanking } from './api/poliglotas';
import type { RankingResponse } from './types/Poliglota';
import './App.css';

type Filtro = 'todos' | 'estudaram' | 'pendentes';
const PARTICIPANTES_VAZIOS: RankingResponse['poliglotas'] = [];

export default function App() {
  const [ranking, setRanking] = useState<RankingResponse | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [username, setUsername] = useState('');
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [adicionando, setAdicionando] = useState(false);
  const [atualizando, setAtualizando] = useState(false);

  const recarregar = useCallback(async () => {
    setErro('');
    try {
      setRanking(await buscarRanking());
      return true;
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Ocorreu um erro ao carregar os participantes.');
      return false;
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void recarregar();
  }, [recarregar]);

  const poliglotas = ranking?.poliglotas ?? PARTICIPANTES_VAZIOS;
  const resumo = ranking?.resumo;
  const filtrados = useMemo(() => poliglotas.filter((poliglota) => {
    const correspondeBusca = poliglota.nome.toLocaleLowerCase('pt-BR').includes(busca.toLocaleLowerCase('pt-BR'));
    const correspondeFiltro =
      filtro === 'todos' ||
      (filtro === 'estudaram' && poliglota.statusAtividade === 'hoje') ||
      (filtro === 'pendentes' && poliglota.statusAtividade !== 'hoje');
    return correspondeBusca && correspondeFiltro;
  }), [busca, filtro, poliglotas]);

  const dataReferencia = useMemo(() => {
    if (!ranking?.dataReferencia) return new Date();
    const [ano, mes, dia] = ranking.dataReferencia.split('-').map(Number);
    return new Date(ano, mes - 1, dia);
  }, [ranking?.dataReferencia]);

  const adicionarPoliglota = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nome = username.trim().replace(/^@/, '');
    if (!nome) return;

    setAdicionando(true);
    setErro('');
    setMensagem('');
    try {
      await adicionarParticipante(nome);
      setUsername('');
      const recarregado = await recarregar();
      if (recarregado) setMensagem(`@${nome} agora está no seu ranking.`);
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Ocorreu um erro ao adicionar o participante.');
    } finally {
      setAdicionando(false);
    }
  };

  const atualizarDados = async () => {
    setAtualizando(true);
    setErro('');
    setMensagem('');
    try {
      await atualizarParticipantes();
      if (await recarregar()) setMensagem('Ofensivas atualizadas com sucesso.');
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Ocorreu um erro ao atualizar os dados.');
    } finally {
      setAtualizando(false);
    }
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="DuoRank, início">
          <span className="brand-mark" aria-hidden="true">D</span>
          <span>duo<span className="brand-accent">rank</span></span>
        </a>
        <span className="today-label">
          <span className="today-dot" />
          {new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(dataReferencia)}
        </span>
      </header>

      <section className="welcome-section">
        <div>
          <p className="eyebrow">SEU GRUPO, UM DIA DE CADA VEZ</p>
          <h1>Aprender junto<br />mantém a chama acesa.</h1>
          <p className="welcome-copy">Acompanhe as ofensivas do grupo e veja quem já estudou hoje.</p>
        </div>
        <div className="hero-flame" aria-hidden="true">🔥</div>
      </section>

      <section className="stats-grid" aria-label="Resumo do grupo">
        <article className="stat-card">
          <span className="stat-icon stat-icon-green" aria-hidden="true">♧</span>
          <div><p>Participantes</p><strong>{resumo?.totalPoliglotas ?? '—'}</strong></div>
        </article>
        <article className="stat-card">
          <span className="stat-icon stat-icon-orange" aria-hidden="true">✓</span>
          <div className="stat-progress-copy">
            <p>Estudaram hoje</p>
            <strong>{resumo?.estudaramHoje ?? '—'}<small> / {resumo?.totalPoliglotas ?? '—'}</small></strong>
            <div
              className="stat-progress"
              role="progressbar"
              aria-label="Progresso diário do grupo"
              aria-valuenow={resumo?.percentualAtividadeHoje ?? 0}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span style={{ width: `${resumo?.percentualAtividadeHoje ?? 0}%` }} />
            </div>
          </div>
        </article>
        <article className="stat-card">
          <span className="stat-icon stat-icon-yellow" aria-hidden="true">🔥</span>
          <div><p>Maior ofensiva</p><strong>{resumo?.maiorOfensiva ?? '—'}<small>{resumo ? ' dias' : ''}</small></strong></div>
        </article>
      </section>

      <div className="content-grid">
        <section className="ranking-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">CONSISTÊNCIA DO GRUPO</p>
              <h2>Ofensivas</h2>
            </div>
            <button className="refresh-button" type="button" onClick={atualizarDados} disabled={atualizando || carregando}>
              <span className={atualizando ? 'refresh-icon spinning' : 'refresh-icon'} aria-hidden="true">↻</span>
              {atualizando ? 'Atualizando' : 'Atualizar'}
            </button>
          </div>

          <div className="ranking-toolbar">
            <div className="filter-tabs" role="group" aria-label="Filtrar participantes">
              <button className={filtro === 'todos' ? 'filter-tab active' : 'filter-tab'} onClick={() => setFiltro('todos')} type="button">Todos</button>
              <button className={filtro === 'estudaram' ? 'filter-tab active' : 'filter-tab'} onClick={() => setFiltro('estudaram')} type="button">Estudaram</button>
              <button className={filtro === 'pendentes' ? 'filter-tab active' : 'filter-tab'} onClick={() => setFiltro('pendentes')} type="button">Pendentes</button>
            </div>
            <label className="search-box">
              <span aria-hidden="true">⌕</span>
              <input value={busca} onChange={(event) => setBusca(event.target.value)} placeholder="Buscar pessoa" aria-label="Buscar pessoa" />
            </label>
          </div>

          {erro && <div className="notice notice-error" role="alert">{erro}</div>}
          {mensagem && <div className="notice notice-success" role="status">{mensagem}</div>}

          <div className="ranking-list">
            {carregando ? (
              <div className="empty-state"><span className="loading-spinner" />Carregando participantes...</div>
            ) : filtrados.length > 0 ? (
              <>
                <div className="list-labels"><span>RANKING</span><span>OFENSIVA</span><span>ATIVIDADE</span></div>
                {filtrados.map((poliglota) => (
                  <PoliglotaItem
                    key={poliglota.id}
                    poliglota={poliglota}
                  />
                ))}
              </>
            ) : ranking === null && erro ? (
              <div className="empty-state">
                <strong>Ranking indisponível</strong>
                <span>Não foi possível consultar os participantes agora. Tente novamente após verificar a conexão com a API.</span>
              </div>
            ) : (resumo?.totalPoliglotas ?? 0) === 0 ? (
              <div className="empty-state">
                <span className="empty-emoji" aria-hidden="true">🌱</span>
                <strong>Seu grupo começa com você</strong>
                <span>Adicione o primeiro participante para acompanhar as ofensivas por aqui.</span>
              </div>
            ) : (
              <div className="empty-state">Nenhuma pessoa encontrada com esse filtro.</div>
            )}
          </div>
        </section>

        <aside className="sidebar">
          <section className="add-card">
            <div className="add-icon" aria-hidden="true">＋</div>
            <p className="eyebrow">CRESÇA SEU GRUPO</p>
            <h2>Mais gente,<br />mais motivação.</h2>
            <p className="add-copy">Adicione alguém pelo nome de usuário do Duolingo e acompanhe a jornada juntes.</p>
            <form onSubmit={adicionarPoliglota}>
              <label htmlFor="username">Usuário do Duolingo</label>
              <div className="input-wrap">
                <span aria-hidden="true">@</span>
                <input id="username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="nome de usuário" autoComplete="off" />
              </div>
              <button className="add-button" type="submit" disabled={adicionando || !username.trim()}>
                {adicionando ? 'Adicionando...' : 'Adicionar participante'}
                {!adicionando && <span aria-hidden="true">→</span>}
              </button>
            </form>
          </section>
          <section className="tip-card">
            <span className="tip-icon" aria-hidden="true">✦</span>
            <div><strong>Um dia de cada vez</strong><p>A ofensiva se mantém quando você pratica diariamente. Dê uma força pra quem ainda não estudou!</p></div>
          </section>
        </aside>
      </div>
      <footer className="page-footer"><span>DUORANK</span><span>Pequenos passos. Grandes ofensivas.</span></footer>
    </main>
  );
}
