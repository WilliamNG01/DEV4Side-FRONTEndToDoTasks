import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';

// Crea il contesto di autenticazione
export const AuthContext = createContext(null);

// URL base della tua API di backend. Assicurati di aggiornarlo con il tuo URL reale.
// In un progetto reale, questo verrebbe gestito tramite variabili d'ambiente (es. process.env.REACT_APP_API_BASE_URL)
const API_BASE_URL = 'https://webapitodolist20250728153145.azurewebsites.net/'; 

/**
 * Componente Provider per l'AuthContext.
 * Gestisce lo stato del token JWT e le funzioni di login/logout.
 * @param {object} { children } - I componenti figli che avranno accesso al contesto.
 */
export const AuthProvider = ({ children }) => {
  // Stato per il token JWT, inizializzato dal localStorage per mantenere la sessione
  const [token, setToken] = useState(() => localStorage.getItem('jwt_token'));
  // Stato per indicare se l'autenticazione è in corso (es. per mostrare un loader)
  const [loading, setLoading] = useState(false);
  // Stato per gestire eventuali errori di autenticazione
  const [error, setError] = useState(null);

  // Effetto per aggiornare il localStorage ogni volta che il token cambia
  useEffect(() => {
    if (token) {
      localStorage.setItem('jwt_token', token);
    } else {
      localStorage.removeItem('jwt_token');
    }
  }, [token]);

  /**
   * Funzione per effettuare il login.
   * Invia le credenziali all'API e salva il token JWT.
   * @param {string} username - Il nome utente.
   * @param {string} password - La password.
   * @returns {Promise<boolean>} Vero se il login ha successo, Falso altrimenti.
   */
  const login = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      // Endpoint di login della tua API (es. /auth/login)
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Credenziali non valide. Riprova.');
      }

      const data = await response.json();
      // Assumiamo che la tua API restituisca un oggetto con una proprietà 'token'
      if (data.token) {
        setToken(data.token);
        return true;
      } else {
        throw new Error('Risposta API non valida: token non trovato.');
      }
    } catch (err) {
      console.error("Errore durante il login:", err);
      setError(err.message || 'Si è verificato un errore durante il login.');
      setToken(null); // Assicurati che il token sia nullo in caso di errore
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Funzione per effettuare il logout.
   * Rimuove il token e resetta lo stato di autenticazione.
   */
  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('jwt_token');
    setError(null);
    // Potresti voler reindirizzare l'utente alla pagina di login qui
    // Esempio: history.push('/login'); se usi React Router
  }, []);

  /**
   * Funzione helper per effettuare chiamate API autenticate.
   * Aggiunge automaticamente l'header Authorization con il token JWT.
   * @param {string} url - Il percorso dell'API (es. '/lists').
   * @param {string} method - Il metodo HTTP (GET, POST, PUT, DELETE).
   * @param {object|null} body - Il corpo della richiesta per POST/PUT.
   * @returns {Promise<object|array>} La risposta JSON dal backend.
   * @throws {Error} Se la richiesta fallisce o non è autorizzata.
   */
  const fetchWithAuth = useCallback(async (url, method = 'GET', body = null) => {
    if (!token) {
      // Se non c'è token, l'utente non è autenticato. Forza il logout.
      logout();
      throw new Error('Non autenticato. Effettua nuovamente il login.');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Aggiunge il token JWT
    };

    const config = {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, config);

      if (response.status === 401 || response.status === 403) {
        // Token scaduto o non valido / Non autorizzato. Forza il logout.
        logout();
        throw new Error('Sessione scaduta o non autorizzata. Effettua nuovamente il login.');
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText })); // Tenta di leggere l'errore, altrimenti usa statusText
        throw new Error(errorData.message || `Errore API: ${response.statusText} (${response.status})`);
      }
      // Se la risposta è 204 No Content (es. per DELETE), non tentare di parsare JSON.
      if (response.status === 204) {
        return {}; 
      }
      return await response.json();
    } catch (err) {
      console.error(`Errore nella richiesta ${method} ${url}:`, err);
      throw err; // Rilancia l'errore per essere gestito dal componente che chiama
    }
  }, [token, logout]); // Dipende dal token e dalla funzione logout

  // Il valore che verrà fornito a tutti i consumatori del contesto
  const authContextValue = {
    token,
    isAuthenticated: !!token, // Convenienza per verificare se l'utente è autenticato
    loading,
    error,
    login,
    logout,
    fetchWithAuth, // Esponi la funzione per le chiamate API autenticate
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook personalizzato per un facile accesso all'AuthContext.
 * @returns {object} Il valore del contesto di autenticazione.
 * @throws {Error} Se usato al di fuori di un AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve essere usato all\'interno di un AuthProvider');
  }
  return context;
};