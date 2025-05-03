import { useEffect, useState } from 'react';
import axios from 'axios';

function PoliglotasList() {
  const [poliglotas, setPoliglotas] = useState([]);

  useEffect(() => {
    axios.get()
  })
  return <h1>Página de Listar</h1>;
}

export default PoliglotasList;
