import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UIContext } from '../contexts/UIContext.jsx';
import Api from '../api/apiService.js'; // ✅ uso del servizio centrale

const RegistrationForm = () => {
  const { showNotification } = useContext(UIContext);
  const navigate = useNavigate();
  // Stati per ogni campo del form, basati su RegisterUserDto
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState(''); 
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Per la conferma della password

  // Stati per la gestione del feedback utente
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' o 'danger'
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showNotification('Le password non corrispondono.', 'danger');
      return;
    }

    const userData = {
      firstName,
      lastName,
      userName,
      email,
      birthDate: birthDate ? new Date(birthDate).toISOString() : null,
      password,
    };

    try {
      await Api.register(userData); // ✅ chiamata centralizzata
      showNotification('Registrazione avvenuta con successo!', 'success');
      navigate('/login');
    } catch (err) {
      showNotification(err.message, 'danger');
    }
  };

  return (
     <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4 rounded-lg" style={{ maxWidth: '500px', width: '100%' }}>
        <h2 className="card-title text-center mb-4 text-success">Registrati</h2>
        {/* Visualizzazione dei messaggi di feedback */}
        {message && (
          <div className={`alert alert-${messageType} rounded-pill text-center mb-3`} role="alert">
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="firstName">Nome</label>
              <input
                type="text"
                className="form-control rounded-pill"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="lastName">Cognome</label>
              <input
                type="text"
                className="form-control rounded-pill"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group mb-3">
            <label htmlFor="userName">Nome Utente</label>
            <input
              type="text"
              className="form-control rounded-pill"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control rounded-pill"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="birthDate">Data di Nascita</label>
            <input
              type="date"
              className="form-control rounded-pill"
              id="birthDate"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-3">
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

          <div className="form-group mb-4">
            <label htmlFor="confirmPassword">Conferma Password</label>
            <input
              type="password"
              className="form-control rounded-pill"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-success btn-block w-100 rounded-pill py-2" disabled={loading}>
            {loading ? 'Registrazione in corso...' : 'Registrati'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;