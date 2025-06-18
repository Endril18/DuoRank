import { useEffect, useState } from 'react';
import axios from 'axios';
import { Poliglota } from '../types/poliglota';
import { calcularStatusOfensiva } from '../shared/utils';

const Dashboard = () => {
  const [poliglotas, setPoliglotas] = useState<Poliglota[]>([]);
  const [username, setUsername] = useState(''); // Estado para o input
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Busca poliglotas existentes
  useEffect(() => {
    const fetchPoliglotas = async () => {
      try {
        const url = `${import.meta.env.VITE_API_BACKEND}poliglotas`;
        const response = await axios.get(url);
        setPoliglotas(response.data);
      } catch (error) {
        console.error('Erro ao buscar poliglotas', error);
      }
    };
    fetchPoliglotas();
  }, []);

  // Função para adicionar novo poliglota
  const handleAdicionarPoliglota = async () => {
    if (!username.trim()) {
      setError('Digite um username do Duolingo');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BACKEND}poliglotas`,
        { username }
      );

      // Atualiza a lista de poliglotas
      setPoliglotas([...poliglotas, response.data]);
      setUsername('');
    } catch (err) {
      setError('Erro ao adicionar poliglota. Verifique o username.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Poliglotas - Ofensiva</h2>

      {/* Formulário para adicionar novo poliglota */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Adicionar Poliglota</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username do Duolingo"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleAdicionarPoliglota}
            disabled={isLoading}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isLoading ? 'Adicionando...' : 'Adicionar'}
          </button>
        </div>
        {error && <p className="mt-2 text-red-500">{error}</p>}
      </div>

      {/* Tabela de poliglotas */}
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