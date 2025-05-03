import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Register from '../pages/Register';
import PoliglotasList from '../pages/PoliglotasList';
import Rank from '../pages/Rank';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/poliglotas-list" element={<PoliglotasList />} />
        <Route path="/rank" element={<Rank />} />
      </Routes>
    </Router>
  );
}

export default App;
