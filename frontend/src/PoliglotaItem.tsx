import { formatarDataAtividade, getStatusAtividade, type Poliglota } from './types/Poliglota';

interface PoliglotaItemProps {
  poliglota: Poliglota;
  rank: number;
}

const statusTexto = {
  hoje: 'Estudou hoje',
  ontem: 'Estudou ontem · hoje é dia de manter',
  atrasada: 'Ofensiva em risco',
  'sem-registro': 'Ainda sem atividade',
};

export default function PoliglotaItem({ poliglota, rank }: PoliglotaItemProps) {
  const status = getStatusAtividade(poliglota.ultimaAtividade);
  const iniciais = poliglota.nome.slice(0, 2).toLocaleUpperCase('pt-BR');

  return (
    <article className="poliglota-item-row">
      <span className={`rank-number ${rank <= 3 ? 'top-rank' : ''}`}>{String(rank).padStart(2, '0')}</span>
      <div className="avatar" aria-hidden="true">{iniciais}</div>
      <div className="info-principal">
        <strong className="nome-poliglota">{poliglota.nome}</strong>
        <span className="idiomas-poliglota">{poliglota.idiomas || 'Idiomas não informados'}</span>
      </div>
      <div className="ofensiva-container" aria-label={`${poliglota.ofensiva} dias de ofensiva`}>
        <span className="ofensiva-icon" aria-hidden="true">🔥</span>
        <strong>{poliglota.ofensiva}</strong>
        <span className="streak-unit">dias</span>
      </div>
      <div className={`activity-status status-${status}`}>
        <span className="status-dot" />
        <span>
          <strong>{statusTexto[status]}</strong>
          {status !== 'hoje' && <small>{formatarDataAtividade(poliglota.ultimaAtividade)}</small>}
        </span>
      </div>
    </article>
  );
}
