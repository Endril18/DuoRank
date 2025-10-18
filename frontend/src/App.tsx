import PoliglotaItem from './PoliglotaItem';

interface Poliglota {
  id: number;
  nome: string;
  ofensiva: number;
  avatarUrl?: string;
}

// Definindo as propriedades que o componente PoliglotaItem vai receber
interface streakes {
    poliglota: Poliglota;
    rank: number;
}

const poliglotas = [
  { id: 1, nome: 'Tiago', ofensiva: 120 },
  { id: 2, nome: 'Maria', ofensiva: 95 },
  { id: 3, nome: 'João', ofensiva: 80 },
];

export default function streakes() {
  return (
    <div className="App">

      <h1>Streak de Poliglotas</h1>

      <div className="streak-list-container">
          {/* Usamos a lista para renderizar o PoliglotaItem para cada um */}
          {poliglotas.map((poliglota, index) => (
              <PoliglotaItem
                  key={poliglota.id}
                  poliglota={poliglota}
                  rank={index + 1}
              />
          ))}
      </div>

    </div>
  );
}