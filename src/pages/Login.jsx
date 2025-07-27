// src/pages/Login.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { UIContext } from '../contexts/UIContext.jsx'; // Importa UIContext

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const { showNotification, setCurrentPage } = useContext(UIContext); // Ottieni setCurrentPage

  const handleSubmit = async (e) => {
    debugger;
    e.preventDefault();
    try {
      await login(username, password);
      showNotification('Login avvenuto con successo!', 'success');
    } catch (error) {
      showNotification(error.message || 'Credenziali non valide.', 'danger');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4 rounded-lg" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="card-title text-center mb-4 text-primary">Login</h2>
        {/* ... codice del form di login ... */}
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className="form-control rounded-pill"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control rounded-pill"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block w-100 rounded-pill py-2">Accedi</button>
        </form>
        {/* Nuovo pulsante per la registrazione */}
        <div className="text-center mt-3">
          <p className="text-muted mb-2">Non hai un account?</p>
          <button
            type="button"
            className="btn btn-outline-success w-100 rounded-pill py-2"
            onClick={() => setCurrentPage('register')} // Cambia pagina a 'register'
          >
            Registrati Ora
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;