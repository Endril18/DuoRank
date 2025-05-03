// src/pages/Rank/index.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Definindo a estrutura de dados dos alunos
interface Poliglota {
  id: number;
  nome: string;
  xp: number;
}

const Rank = () => {
  const [poligotas, setPoligotas] = useState<Poliglota[]>([]);  // Armazenar o ranking dos poliglotas

  useEffect(() => {
    // Fazendo a requisição para o backend para obter o ranking
    axios.get('http://localhost:12110/poliglotas/rank')
      .then(response => setPoligotas(response.data))  // Atualizando o estado com os dados do ranking
      .catch(error => console.error('Erro ao buscar ranking:', error));
  }, []);

  return (
    <div>
      <h1>Página de Rank</h1>
      <div className="ranking-list">
        {poligotas.map(poliglota => (
          <div key={poliglota.id} className="rank-card">
            <h2>{poliglota.nome}</h2>
            <p>Pontos: {poliglota.xp}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rank;
