import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para la redirección
import './HorasTrabajadas.css';

function HorasTrabajadas() {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [documentoIdentidad, setDocumentoIdentidad] = useState('');
  const [tipoAsistente, setTipoAsistente] = useState('');
  const [resultados, setResultados] = useState([]);
  const [tiposAsistente, setTiposAsistente] = useState([]);
  
  const navigate = useNavigate(); // Inicializa useNavigate

  // Obtener los tipos de asistente únicos al montar el componente
  useEffect(() => {
    fetch('http://localhost:8000/api/horas-trabajadas/?fecha_inicio=2000-01-01&fecha_fin=2100-01-01')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Extraer tipos únicos
          const tiposUnicos = [...new Set(data.map(item => item.asistente__tipo_asistente))];
          setTiposAsistente(tiposUnicos);
        } else {
          console.error('Data is not an array:', data);
        }
      })
      .catch(error => console.error('Error fetching tipos de asistente:', error));
  }, []);

  // Obtener registros filtrados
  const fetchRegistros = () => {
    const query = new URLSearchParams({
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
    }).toString();
    
    fetch(`http://localhost:8000/api/horas-trabajadas/?${query}`)
      .then(response => response.json())
      .then(data => {
        // Filtrar por nombre completo, documento de identidad y tipo de asistente
        const resultadosFiltrados = data
          .filter(item => item.asistente__nombre_completo.toLowerCase().startsWith(nombreCompleto.toLowerCase()))
          .filter(item => item.asistente__documento_identidad.startsWith(documentoIdentidad))
          .filter(item => tipoAsistente ? item.asistente__tipo_asistente === tipoAsistente : true);
        
        setResultados(resultadosFiltrados);
      })
      .catch(error => console.error('Error fetching registros:', error));
  };

  // Llama a la función de búsqueda cuando cambien los filtros
  useEffect(() => {
    fetchRegistros();
  }, [fechaInicio, fechaFin, nombreCompleto, documentoIdentidad, tipoAsistente]);

  return (
    <div className="container">
      <h1 className="header">Reporte de Horas Trabajadas</h1>
      <div className="filters">
        <label>Fecha de Inicio:</label>
        <input
          type="date"
          value={fechaInicio}
          onChange={e => setFechaInicio(e.target.value)}
        />
        <label>Fecha de Fin:</label>
        <input
          type="date"
          value={fechaFin}
          onChange={e => setFechaFin(e.target.value)}
        />
      </div>
      <div className="filters">
        <label>Nombre Completo:</label>
        <input
          type="text"
          value={nombreCompleto}
          onChange={e => setNombreCompleto(e.target.value)}
        />
        <label>Documento de Identidad:</label>
        <input
          type="text"
          value={documentoIdentidad}
          onChange={e => setDocumentoIdentidad(e.target.value)}
        />
        <label>Tipo de Asistente:</label>
        <select value={tipoAsistente} onChange={e => setTipoAsistente(e.target.value)}>
          <option value="">Todos</option>
          {tiposAsistente.map((tipo, index) => (
            <option key={index} value={tipo}>{tipo}</option>
          ))}
        </select>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>Documento de Identidad</th>
            <th>Tipo de Asistente</th>
            <th>Tipo de Empleado</th>
            <th>Total Horas</th>
          </tr>
        </thead>
        <tbody>
          {resultados.map((item, index) => (
            <tr key={index}>
              <td>{item.asistente__nombre_completo}</td>
              <td>{item.asistente__documento_identidad}</td>
              <td>{item.asistente__tipo_asistente}</td>
              <td>{item.asistente__empleado__tipo_empleado || 'N/A'}</td>
              <td>{item.total_horas}</td>
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

export default HorasTrabajadas;
