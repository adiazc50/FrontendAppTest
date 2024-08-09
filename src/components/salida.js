import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Salida() {
  const [nombre, setNombre] = useState('');
  const [cedula, setCedula] = useState('');
  const [fechaHoraIngreso, setFechaHoraIngreso] = useState('');
  const [fechaHoraSalida, setFechaHoraSalida] = useState('');
  const [tipo, setTipo] = useState('');
  const [motivo, setMotivo] = useState('');
  const [mostrarMotivo, setMostrarMotivo] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extraer los datos pasados desde la vista anterior
  const { asistente, fechaHoraIngreso: ingreso, fechaHoraSalida: salida } = location.state || {};

  useEffect(() => {
    if (asistente) {
      setNombre(asistente.nombre_completo || '');
      setCedula(asistente.documento_identidad || '');
      setFechaHoraIngreso(ingreso || '');
      setFechaHoraSalida(salida || '');

      // Obtener la fecha y hora actual para salida
      const now = new Date();
      const day = now.getDate().toString().padStart(2, '0');
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const year = now.getFullYear();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}:00.000Z`;
      setFechaHoraSalida(currentDateTime); // Ajustar si es necesario

      // Mostrar el campo de motivo si la hora es menor a las 16:00
      if (parseInt(hours) < 16) {
        setMostrarMotivo(true);
      }
    }
  }, [asistente, ingreso, salida]);

  const handleTipoChange = (event) => {
    setTipo(event.target.value);
  };

  const handleMotivoChange = (event) => {
    setMotivo(event.target.value);
  };

  const handleSubmit = () => {
    // Hacer la petición PUT para actualizar la hora de salida y el motivo
    fetch(`http://localhost:8000/api/registros/ultimo/${cedula}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hora_salida: fechaHoraSalida,
        motivo_antes_16: mostrarMotivo ? motivo : 'No aplica',
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Registro actualizado:', data);
      // Navegar de vuelta al componente App.js
      navigate('/');
    })
    .catch(error => {
      console.error('Error al actualizar el registro:', error);
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Registro de Salida</h1>
        <div className="App-form">
          <label htmlFor="nombre" className="App-label">Nombre:</label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            readOnly
            className="App-input"
          />
          <label htmlFor="cedula" className="App-label">Cédula:</label>
          <input
            id="cedula"
            type="text"
            value={cedula}
            readOnly
            className="App-input"
          />
          <label htmlFor="fechaHoraIngreso" className="App-label">Fecha y Hora de Ingreso:</label>
          <input
            id="fechaHoraIngreso"
            type="text"
            value={fechaHoraIngreso}
            readOnly
            className="App-input"
          />
          <label htmlFor="fechaHoraSalida" className="App-label">Fecha y Hora de Salida:</label>
          <input
            id="fechaHoraSalida"
            type="text"
            value={fechaHoraSalida}
            onChange={(e) => setFechaHoraSalida(e.target.value)}
            className="App-input"
          />
          <div className="App-checkboxes">
            <label className="App-checkbox">
              <input
                type="radio"
                name="tipo"
                value="empleado"
                checked={tipo === 'empleado'}
                onChange={handleTipoChange}
              />
              Empleado
            </label>
            <label className="App-checkbox">
              <input
                type="radio"
                name="tipo"
                value="proveedor"
                checked={tipo === 'proveedor'}
                onChange={handleTipoChange}
              />
              Proveedor
            </label>
            <label className="App-checkbox">
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
          {mostrarMotivo && (
            <div className="App-form">
              <label htmlFor="motivo" className="App-label">Motivo de Retiro:</label>
              <select
                id="motivo"
                value={motivo}
                onChange={handleMotivoChange}
                className="App-input"
              >
                <option value="">Seleccione un motivo</option>
                <option value="Cita Medica">Cita Médica</option>
                <option value="Calamidad">Calamidad</option>
                <option value="Diligencia Personal">Diligencia Personal</option>
              </select>
            </div>
          )}
          <button onClick={handleSubmit} className="App-button">Registrar Salida</button>
        </div>
      </header>
    </div>
  );
}

export default Salida;
