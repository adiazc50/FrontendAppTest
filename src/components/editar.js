import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../App.css';

function Editar() {
  const navigate = useNavigate();
  const location = useLocation();
  const asistente = location.state?.asistente; // Obtener los datos del asistente pasados por el estado

  const [nombre, setNombre] = useState(asistente?.nombre_completo || '');

  useEffect(() => {
    if (!asistente) {
      console.error('No se pasaron datos del asistente.');
      navigate('/');
    }
  }, [asistente, navigate]);

  const handleNameChange = () => {
    if (!asistente) {
      console.error('No se pueden actualizar los datos porque el asistente es indefinido.');
      return;
    }

    const updatedAsistente = {
      id: asistente.id,
      nombre_completo: nombre,
      documento_identidad: asistente.documento_identidad,
      tipo_asistente: asistente.tipo_asistente,
    };

    // Enviar la petición PUT al servidor
    fetch(`http://localhost:8000/api/asistentes/${asistente.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedAsistente),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al actualizar el asistente.');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Asistente actualizado con éxito:', data);
        // Regresar al componente principal App.js
        navigate('/');
      })
      .catch((error) => {
        console.error('Error al actualizar el asistente:', error);
      });
  };

  const handleDelete = () => {
    if (!asistente) {
      console.error('No se pueden eliminar los datos porque el asistente es indefinido.');
      return;
    }

    // Enviar la petición DELETE al servidor
    fetch(`http://localhost:8000/api/asistentes/${asistente.id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al eliminar el asistente.');
        }
        console.log('Asistente eliminado con éxito.');
        // Regresar al componente principal App.js
        navigate('/');
      })
      .catch((error) => {
        console.error('Error al eliminar el asistente:', error);
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Editar Asistente</h1>
        <div className="App-form">
          <label htmlFor="nombre" className="App-label">Nombre:</label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ingrese el nuevo nombre"
            className="App-input"
          />
          <button onClick={handleNameChange} className="App-button">Cambiar Nombre</button>
          <button onClick={handleDelete} className="App-button" style={{ backgroundColor: 'red', marginLeft: '10px' }}>
            Eliminar
          </button>
        </div>
      </header>
    </div>
  );
}

export default Editar;
