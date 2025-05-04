import { BrowserRouter, Route, Routes as Switch, Navigate } from "react-router-dom";
import { Register, Dashboard, PoliglotasList, Rank} from '../pages/index';


export const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/entrar" element={<Register />} />
        <Route path="/pagina-inicial" element={<Dashboard />} />
        <Route path="/poliglotas-list" element={<PoliglotasList />} />
        <Route path="/rank" element={<Rank />} />

        <Route path="*" element={<Navigate replace to="/pagina-inicial" />} />
      </Switch>
    </BrowserRouter>
  );
}

