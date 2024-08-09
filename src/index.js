import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Registrar from './components/registrar';
import Editar from './components/editar';
import Salida from './components/salida';
import ReporteEvacuacion from './components/ReporteEvaciacion';
import HorasTrabajadas from './components/HorasTrabajadas';
import './index.css'; // Asegúrate de tener este archivo para los estilos globales

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/registrar" element={<Registrar />} />
      <Route path="/editar" element={<Editar />} />
      <Route path="/salida" element={<Salida />} />
      <Route path="/ReporteEvacuacion" element={<ReporteEvacuacion />} />
      <Route path="/HorasTrabajadas" element={<HorasTrabajadas />} />
    </Routes>
  </Router>
);
