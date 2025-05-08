import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Poliglota } from '../../types/poliglota'; // Ajuste o caminho conforme necessário
import { calcularStatusOfensiva } from '../../shared/utils';

const Dashboard = () => {
  const [poliglotas, setPoliglotas] = useState<Poliglota[]>([]);

  useEffect(() => {
    // Buscar os poliglotas do backend
    axios.get('http://localhost:12110/poliglotas') // Altere o endpoint para o correto
      .then(response => {
        setPoliglotas(response.data);
      })
      .catch(error => console.error('Erro ao buscar poliglotas', error));
  }, []);

  return (
    <div>
      <h2>Dashboard - Status da Ofensiva</h2>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>XP</th>
            <th>Status da Ofensiva</th>
          </tr>
        </thead>
        <tbody>
          {poliglotas.map((poliglota) => {
            const statusOfensiva = calcularStatusOfensiva(poliglota.ultimaAtividade);
            return (
              <tr key={poliglota.id}>
                <td>{poliglota.nome}</td>
                <td>{poliglota.xp}</td>
                <td>{statusOfensiva}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
