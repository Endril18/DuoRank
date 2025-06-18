import { useEffect, useState } from 'react';
import axios from 'axios';
import { Poliglota } from '../types/poliglota';
import { calcularStatusOfensiva } from '../shared/utils';


const PoliglotaList = () => {
  const [poliglotas, setPoliglotas] = useState<Poliglota[]>([]);

  useEffect(() => {
    // Buscar os poliglotas do backend
    const url = `${import.meta.env.VITE_API_BACKEND}poliglotas`; // endpoint para listar poliglotas
    axios.get(url)
      .then(response => {
        setPoliglotas(response.data);
      })
      .catch(error => console.error('Erro ao listar os poliglotas', error));
  }, []);

    return (
    <div>
      <h2>Poliglotas</h2>
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

export default PoliglotaList;
