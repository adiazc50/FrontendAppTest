import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function App() {
  const [documento, setDocumento] = useState('');
  const [registro, setRegistro] = useState(null); // Estado para almacenar la información del registro
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setDocumento(e.target.value);
  };

  const handleSearch = () => {
    console.log('Buscar documento:', documento);
    // Pasar el documento como estado a la vista Registrar
    navigate('/registrar', { state: { documento } });
  };

  const handleEditAsistente = () => {
    console.log('Editar documento:', documento);
    // Realizar la petición GET al endpoint
    fetch(`http://localhost:8000/api/asistentes/consultapordocumento/${documento}/`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const asistente = data[0];
          // Mostrar los datos en la consola
          console.log('Datos del asistente:', asistente);
          // Navegar a la vista Editar con el estado del asistente
          navigate('/Editar', { state: { asistente } });
        } else {
          console.error('No se encontró un asistente con ese documento.');
        }
      })
      .catch(error => {
        console.error('Error al buscar asistente:', error);
      });
  };

  const handleEditSalida = () => {
    // Realizar la petición GET al endpoint para obtener el registro
    fetch(`http://localhost:8000/api/registros/ultimo/${documento}/`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Guardar la información en el estado
        setRegistro(data);
        console.log('Datos del registro:', data);
        // Navegar a la vista Salida con los datos en el estado
        navigate('/Salida', { state: { asistente: data.asistente, fechaHoraIngreso: data.hora_ingreso, fechaHoraSalida: data.hora_salida } });
      })
      .catch(error => {
        console.error('Error al obtener el registro:', error);
      });
  };

  const handleEvacuationReport = () => {
    navigate('/ReporteEvacuacion');
  };

  const handleWorkHoursReport = () => {
    navigate('/HorasTrabajadas');
  };

  const handleAreaWorkHoursReport = () => {
    navigate('/reporte-horas-area');
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
          <button onClick={handleEditAsistente} className="App-button">Editar</button>
          <button onClick={handleEditSalida} className="App-button">Registrar Salida</button>
          <button onClick={handleEvacuationReport} className="App-button">Reporte de evacuación</button>
          <button onClick={handleWorkHoursReport} className="App-button">Reporte de horas laboradas por trabajador</button>
          <button onClick={handleAreaWorkHoursReport} className="App-button">Horas trabajadas por área</button>
        </div>
      </header>
    </div>
  );
}

export default App;
