import "./App.css";
import Login from "./pages/login.js";
import Recomendador from "./pages/recomendador.js";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          {<Route path="/:usuario/recomendador" element={<Recomendador />} />}
        </Routes>
      </Router>
    </LocalizationProvider>
  );
}

export default App;
