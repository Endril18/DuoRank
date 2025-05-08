import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login, Dashboard, PoliglotasList, Rank } from '../pages'; // Páginas importadas

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/entrar" element={<Login />} />
        <Route path="/pagina-inicial" element={<Dashboard />} />
        <Route path="/poliglotas-list" element={<PoliglotasList />} />
        <Route path="/rank" element={<Rank />} />
        <Route path="*" element={<Navigate replace to="/pagina-inicial" />} /> {/* Redirecionamento */}
      </Routes>
    </BrowserRouter>
  );
};
