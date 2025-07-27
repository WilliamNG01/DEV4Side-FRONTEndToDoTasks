import React, { useState, useContext } from 'react';
// Puoi importare UIContext se hai un sistema di notifica globale
import { UIContext } from '../contexts/UIContext.jsx'; // Decommentato

// URL base della tua API di backend. Assicurati di adattare questo URL.
// In produzione, useresti variabili d'ambiente (es: process.env.REACT_APP_API_BASE_URL)
const API_BASE_URL = 'https://localhost:7129'; // Adatta all'URL del tuo backend

const RegistrationForm = () => {
  const { showNotification } = useContext(UIContext); // Decommentato e usato

  // Stati per ogni campo del form, basati su RegisterUserDto
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState(''); // Formato YYYY-MM-DD per input type="date"
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Per la conferma della password

  // Stati per la gestione del feedback utente
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' o 'danger'
  const [loading, setLoading] = useState(false);

  /**
   * Gestisce l'invio del form di registrazione.
   * Invia i dati utente all'API di backend.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Impedisce il ricaricamento della pagina

    setMessage(''); // Resetta i messaggi
    setMessageType('');
    setLoading(true);

    // Validazione lato client
    if (password !== confirmPassword) {
      setMessage('Le password non corrispondono.');
      setMessageType('danger');
      setLoading(false);
      showNotification('Le password non corrispondono.', 'danger'); // Ora usa showNotification
      return;
    }

    // Creazione dell'oggetto dati da inviare, corrispondente a RegisterUserDto
    const userData = {
      firstName,
      lastName,
      userName,
      email,
      // Converte la data di nascita in formato ISO 8601 se fornita
      birthDate: birthDate ? new Date(birthDate).toISOString() : null,
      password,
    };

    try {
      // Endpoint di registrazione della tua API (es: /auth/register o /users/register)
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        // Tenta di leggere il messaggio di errore dal backend
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || 'Registrazione fallita. Riprova.');
      }

      // Se la registrazione ha successo
      setMessage('Registrazione avvenuta con successo! Ora puoi effettuare il login.');
      setMessageType('success');
      showNotification('Registrazione avvenuta con successo! Ora puoi effettuare il login.', 'success'); // Ora usa showNotification

      // Resetta il form dopo un successo
      setFirstName('');
      setLastName('');
      setUserName('');
      setEmail('');
      setBirthDate('');
      setPassword('');
      setConfirmPassword('');

    } catch (err) {
      console.error('Errore di registrazione:', err);
      setMessage(err.message || 'Si è verificato un errore inatteso durante la registrazione.');
      setMessageType('danger');
      showNotification(err.message || 'Si è verificato un errore inatteso durante la registrazione.', 'danger'); // Ora usa showNotification
    } finally {
      setLoading(false);
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