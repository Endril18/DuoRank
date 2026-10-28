import { useEffect, useMemo, useState, type FormEvent } from 'react';
import PoliglotaItem from './PoliglotaItem';
import { getStatusAtividade, isPoliglota, type Poliglota } from './types/Poliglota';
import './App.css';

const API_URL = (import.meta.env.VITE_API_BACKEND || 'http://localhost:12110/api/poliglotas').replace(/\/$/, '');
type Filtro = 'todos' | 'estudaram' | 'pendentes';

async function carregarPoliglotas(): Promise<Poliglota[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Não foi possível carregar os participantes. Verifique se a API está disponível.');
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('A resposta da API não tem o formato esperado.');
  }

  if (!data.every(isPoliglota)) {
    throw new Error('A resposta da API contém participantes inválidos.');
  }

  return data;
}

export default function App() {
  const [poliglotas, setPoliglotas] = useState<Poliglota[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [username, setUsername] = useState('');
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [adicionando, setAdicionando] = useState(false);
  const [atualizando, setAtualizando] = useState(false);

  const recarregar = async () => {
    setErro('');
    try {
      setPoliglotas(await carregarPoliglotas());
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Ocorreu um erro ao carregar os participantes.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    void recarregar();
  }, []);

  const ordenados = useMemo(
    () => [...poliglotas].sort((a, b) => b.ofensiva - a.ofensiva || a.nome.localeCompare(b.nome)),
    [poliglotas],
  );
  const estudaramHoje = ordenados.filter((poliglota) => getStatusAtividade(poliglota.ultimaAtividade) === 'hoje').length;
  const maiorOfensiva = ordenados[0]?.ofensiva ?? 0;
  const filtrados = ordenados.filter((poliglota) => {
    const correspondeBusca = poliglota.nome.toLocaleLowerCase('pt-BR').includes(busca.toLocaleLowerCase('pt-BR'));
    const correspondeFiltro =
      filtro === 'todos' ||
      (filtro === 'estudaram' && getStatusAtividade(poliglota.ultimaAtividade) === 'hoje') ||
      (filtro === 'pendentes' && getStatusAtividade(poliglota.ultimaAtividade) !== 'hoje');
    return correspondeBusca && correspondeFiltro;
  });

  const adicionarPoliglota = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nome = username.trim().replace(/^@/, '');
    if (!nome) return;

    setAdicionando(true);
    setErro('');
    setMensagem('');
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: nome }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? data?.message ?? 'Não foi possível adicionar esse participante.');
      }

      setUsername('');
      setMensagem(`@${nome} agora está no seu ranking.`);
      await recarregar();
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
      const response = await fetch(`${API_URL}/atualizar-todos`, { method: 'POST' });
      if (!response.ok) {
        throw new Error('Não foi possível atualizar as ofensivas. Tente novamente.');
      }
      await recarregar();
      setMensagem('Ofensivas atualizadas com sucesso.');
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
          {new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())}
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
          <div><p>Participantes</p><strong>{poliglotas.length}</strong></div>
        </article>
        <article className="stat-card">
          <span className="stat-icon stat-icon-orange" aria-hidden="true">✓</span>
          <div><p>Estudaram hoje</p><strong>{estudaramHoje}<small> / {poliglotas.length}</small></strong></div>
        </article>
        <article className="stat-card">
          <span className="stat-icon stat-icon-yellow" aria-hidden="true">🔥</span>
          <div><p>Maior ofensiva</p><strong>{maiorOfensiva}<small> dias</small></strong></div>
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
                    rank={ordenados.findIndex((item) => item.id === poliglota.id) + 1}
                  />
                ))}
              </>
            ) : poliglotas.length === 0 ? (
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
