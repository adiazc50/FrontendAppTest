import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para la redirección
import './ReporteEvacuacion.css'; // Asegúrate de tener este archivo para los estilos

function ReporteEvacuacion() {
  const [registros, setRegistros] = useState([]);
  const navigate = useNavigate(); // Inicializa useNavigate

  useEffect(() => {
    // Función para obtener datos del endpoint
    const fetchRegistros = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/registros-sin-salida/');
        const data = await response.json();
        setRegistros(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchRegistros();
  }, []);

  return (
    <div className="ReporteEvacuacion">
      <h1>Reporte de Evacuación</h1>
      <table className="ReporteEvacuacion-table">
        <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>Documento de Identidad</th>
            <th>Tipo de Asistente</th>
            <th>Hora de Ingreso</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((registro) => (
            <tr key={registro.id}>
              <td>{registro.asistente.nombre_completo}</td>
              <td>{registro.asistente.documento_identidad}</td>
              <td>{registro.asistente.tipo_asistente}</td>
              <td>{new Date(registro.hora_ingreso).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="button-container">
        <button onClick={() => navigate('/')} className="menu-button">Menú</button>
      </div>
    </div>
  );
}

export default ReporteEvacuacion;
