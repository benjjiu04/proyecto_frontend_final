import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TerminosYCondiciones } from "./components/TerminosYCondiciones.jsx";
import { GestionProducto } from "./GestionProducto.jsx";

import './styles/index.css';
import "./styles/App.css";
import 'bootstrap/dist/css/bootstrap.min.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GestionProducto />
  </StrictMode>,
)

/*createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TerminosYCondiciones />
  </StrictMode>,
)*/
