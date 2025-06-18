import { useEffect, useState } from 'react';
import axios from 'axios';
import { Poliglota } from '../types/poliglota';
import { calcularStatusOfensiva } from '../shared/utils';


const Dashboard = () => {
  const [poliglotas, setPoliglotas] = useState<Poliglota[]>([]);

  useEffect(() => {
    const fetchPoliglotas = async () => {
      try {
        // Correção: usar import.meta.env.VITE_API_BACKEND
        const url = `${import.meta.env.VITE_API_BACKEND}poliglotas`;
        const response = await axios.get(url);
        setPoliglotas(response.data);
      } catch (error) {
        console.error('Erro ao buscar poliglotas', error);
      }
    };

    fetchPoliglotas();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Poliglotas - Ofensiva</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">Nome</th>
              <th className="py-2 px-4 border">XP</th>
              <th className="py-2 px-4 border">Ofensiva</th>
              <th className="py-2 px-4 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {poliglotas.map((poliglota) => (
              <tr key={poliglota.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{poliglota.id}</td>
                <td className="py-2 px-4 border">{poliglota.nome}</td>
                <td className="py-2 px-4 border">{poliglota.xp.toLocaleString()}</td>
                <td className="py-2 px-4 border">{poliglota.ofensiva} dias</td>
                <td className="py-2 px-4 border text-center">
                  {calcularStatusOfensiva(poliglota.ultimaAtividade)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
