import { useEffect, useState } from 'react';
import axios from 'axios';
import { Poliglota } from '../types/poliglota';
import { calcularStatusOfensiva } from '../shared/utils';
import { Card, Dropdown } from 'flowbite-react';
import './style/PoliglotasList.css';

const PoliglotaList = () => {
  const [poliglotas, setPoliglotas] = useState<Poliglota[]>([]);

  useEffect(() => {
    const url = `${import.meta.env.VITE_API_BACKEND}poliglotas`;
    axios.get(url)
      .then(response => setPoliglotas(response.data))
      .catch(error => console.error('Erro ao listar os poliglotas', error));
  }, []);

  return (
    <div className="poliglota-grid">
      {poliglotas.map((poliglota) => {
        const statusOfensiva = calcularStatusOfensiva(poliglota.ultimaAtividade);

        return (
          <Card key={poliglota.id} className="poliglota-card">
            <div className="poliglota-dropdown">
              <Dropdown inline label="">
                <Dropdown.item>
                  <button className="dropdown-item">Editar</button>
                </Dropdown.item>
                <Dropdown.item>
                  <button className="dropdown-item">Exportar Dados</button>
                </Dropdown.item>
                <Dropdown.item>
                  <button className="dropdown-item">Deletar</button>
                </Dropdown.item>
              </Dropdown>
            </div>
            <img
              alt={`Foto do usuário ${poliglota.nome}`}
              src="/images/${poliglota.nome}.png"
              className="poliglota-avatar"
            />
            <h5 className="poliglota-nome">{poliglota.nome}</h5>
            <span className="poliglota-info">XP: {poliglota.xp}</span>
            <span className="poliglota-info">Ofensiva: {poliglota.ofensiva} 🔥</span>
            <span className="poliglota-info">Lição: {statusOfensiva}</span>
            <div className="poliglota-botoes">
              <a href="#" className="botao-ver">Ver Perfil</a>
              <a href="#" className="botao-mensagem">Mensagem</a>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default PoliglotaList;
