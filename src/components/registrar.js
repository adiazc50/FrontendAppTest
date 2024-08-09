import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Registrar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [cedula, setCedula] = useState('');
  const [fechaHora, setFechaHora] = useState('');
  const [tipo, setTipo] = useState('');

  useEffect(() => {
    // Obtener la fecha y hora actual en formato ISO 8601
    const now = new Date();
    const isoString = now.toISOString(); // Formato: YYYY-MM-DDTHH:MM:SSZ
    setFechaHora(isoString);
  }, []);

  useEffect(() => {
    const { documento } = location.state || {};
    if (documento) {
      fetch(`http://localhost:8000/api/asistentes/consultapordocumento/${documento}/`)
        .then(response => response.json())
        .then(data => {
          if (data.length > 0) {
            const asistente = data[0];
            setNombre(asistente.nombre_completo || '');
            setCedula(asistente.documento_identidad || '');
            setTipo(asistente.tipo_asistente || '');
          }
        })
        .catch(error => console.error('Error al obtener los datos del asistente:', error));
    }
  }, [location.state]);

  const handleTipoChange = (event) => {
    setTipo(event.target.value);
  };

  const handleSubmit = () => {
    const registroData = {
      asistente: {
        nombre_completo: nombre || '',
        documento_identidad: cedula || '',
        tipo_asistente: tipo || null,
      },
      hora_ingreso: fechaHora || null,
      hora_salida: null, // Ajusta esto si tienes un valor para hora de salida
      motivo_antes_16: '', // Ajusta esto según tus necesidades
    };

    fetch('http://localhost:8000/api/registros/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registroData),
    })
      .then(response => {
        if (response.ok) {
          console.log('Registro exitoso');
          navigate('/');
        } else {
          return response.json().then(errorData => {
            console.error('Error al registrar:', errorData);
          });
        }
      })
      .catch(error => console.error('Error al hacer la solicitud POST:', error));
  };

  return (
    <div className="Registrar">
      <h1>Registro de Asistente</h1>
      <div className="Registrar-form">
        <label htmlFor="nombre">Nombre:</label>
        <input
          id="nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ingrese su nombre"
          className="Registrar-input"
        />
        <label htmlFor="cedula">Cédula:</label>
        <input
          id="cedula"
          type="text"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
          placeholder="Ingrese su cédula"
          className="Registrar-input"
        />
        <label htmlFor="fechaHora">Fecha y Hora:</label>
        <input
          id="fechaHora"
          type="text"
          value={fechaHora}
          readOnly
          className="Registrar-input"
        />
        <div className="Registrar-checkboxes">
          <label>
            <input
              type="radio"
              name="tipo"
              value="empleado"
              checked={tipo === 'empleado'}
              onChange={handleTipoChange}
            />
            Empleado
          </label>
          <label>
            <input
              type="radio"
              name="tipo"
              value="proveedor"
              checked={tipo === 'proveedor'}
              onChange={handleTipoChange}
            />
            Proveedor
          </label>
          <label>
            <input
              type="radio"
              name="tipo"
              value="invitado"
              checked={tipo === 'invitado'}
              onChange={handleTipoChange}
            />
            Invitado
          </label>
        </div>
        <button onClick={handleSubmit} className="Registrar-button">Registrar</button>
      </div>
    </div>
  );
}

export default Registrar;
