import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard, Register , PoliglotasList, Rank } from './pages';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/poliglotas-list" element={<PoliglotasList />} />
        <Route path="/rank" element={<Rank />} />
      </Routes>
    </Router>
  );
}

export default App;
