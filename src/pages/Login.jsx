import React, { useState, useContext } from 'react';
import { useNavigate  } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { UIContext } from '../contexts/UIContext.jsx';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const { showNotification, setCurrentPage } = useContext(UIContext);
  const navigate = useNavigate(); // Inizializza useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      // Il reindirizzamento alla homepage avviene già nella funzione login
      // del contesto AuthContext (che poi aggiorna il token in App.jsx e triggera l'useEffect)
      showNotification('Login avvenuto con successo!', 'success');
      navigate('/homepage'); // Reindirizza alla homepage dopo il login
    } catch (error) {
      showNotification(error.message || 'Credenziali non valide.', 'danger');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4 rounded-lg" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="card-title text-center mb-4 text-primary">Login</h2>
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
        <div className="text-center mt-3">
          <p className="text-muted mb-2">Non hai un account?</p>
          <button
            type="button"
            className="btn btn-outline-success w-100 rounded-pill py-2"
            onClick={() => navigate('/register')}
          >
            Registrati Ora
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;