import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'; // Usa el mismo archivo CSS para mantener el estilo

function Buscar() {
  const [documento, setDocumento] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setDocumento(e.target.value);
  };

  const handleSearch = () => {
    console.log('Buscar documento:', documento);
    navigate('/registrar');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Bienvenido al sistema de Registros de Ingreso y Salidas</h1>
        <div className="App-form">
          <label htmlFor="documento" className="App-label">Documento:</label>
          <input
            id="documento"
            type="number"
            value={documento}
            onChange={handleInputChange}
            placeholder="Ingrese su documento"
            className="App-input"
          />
          <button onClick={handleSearch} className="App-button">Buscar</button>
        </div>
      </header>
    </div>
  );
}

export default Buscar;
