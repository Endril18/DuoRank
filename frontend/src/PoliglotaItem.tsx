import React from 'react';

// Reutilizamos a interface do App.tsx (poderia ser movida para um arquivo de tipos)
interface Poliglota {
  id: number;
  nome: string;
  ofensiva: number;
  avatarUrl?: string;
}

// URL de avatar padrão (usada se o banco de dados não tiver o link)
const DEFAULT_AVATAR = 'https://simg-ssl.duolingo.com/ssr-avatars/1181272028/SSR-ktlfTAg7BH/large';
const OFENSIVA_ICON = '🔥'; // Usaremos um emoji por enquanto, ou você pode usar uma imagem real

// Definindo as propriedades que o componente PoliglotaItem vai receber
interface PoliglotaItemProps {
    poliglota: Poliglota;
}

export default function PoliglotaItem({ poliglota, streak }: PoliglotaItemProps) {

  return (
    // item-row será nossa classe CSS para o Flexbox
    <div className="poliglota-item-row">

      <img
        className="avatar-pequeno"
        src={poliglota.avatarUrl || DEFAULT_AVATAR}
        alt={`Avatar de ${poliglota.nome}`}
      />

      {/* 4. Ofensiva com Ícone */}
      <div className="ofensiva-container">
        <span className="ofensiva-valor">{poliglota.ofensiva}</span>
        <span className="ofensiva-icon">{OFENSIVA_ICON}</span>
      </div>

    </div>
  );
}