import { useEffect, useState } from 'react';
import axios from 'axios';
import { Poliglota } from '../../types/poliglota';
import { calcularStatusOfensiva } from '../../shared/utils';
import dotenv from "dotenv";

dotenv.config();

const Dashboard = () => {
  const [poliglotas, setPoliglotas] = useState<Poliglota[]>([]);

  useEffect(() => {
    // Buscar os poliglotas do backend
    const url = `${process.env.URL_API}`;
    axios.get(url) // endpoint para listar poliglotas
      .then(response => {
        setPoliglotas(response.data);
      })
      .catch(error => console.error('Erro ao buscar poliglotas', error));
  }, []);

  return (
    <div>
      <h2>Poliglotas - Ofensiva</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>XP</th>
            <th>Ofensiva</th>
            <th>Lição</th>
          </tr>
        </thead>
        <tbody>
          {poliglotas.map((poliglota) => {
            const statusOfensiva = calcularStatusOfensiva(poliglota.ultimaAtividade);
            return (
              <tr key={poliglota.id}>
                <td>{poliglota.id}</td>
                <td>{poliglota.nome}</td>
                <td>{poliglota.xp}</td>
                <td>{poliglota.ofensiva}</td>
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
