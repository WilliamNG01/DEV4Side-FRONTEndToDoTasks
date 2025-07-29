import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import Api from '../api/apiService.js'; // ✅ importa servizio centralizzato

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('jwt_token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    token
      ? localStorage.setItem('jwt_token', token)
      : localStorage.removeItem('jwt_token');
  }, [token]);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const jwt = await Api.login({ username, password });
      setToken(jwt);
      return true;
    } catch (err) {
      console.error('Errore durante il login:', err);
      setError(err.message);
      setToken(null);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('jwt_token');
    setError(null);
    setLists([]);
    setTasks([]);
    setSelectedListId(null);
  }, []);

  const fetchWithAuth = useCallback(async (url, method = 'GET', body = null) => {
    if (!token) {
      logout();
      throw new Error('Non autenticato. Effettua nuovamente il login.');
    }
    return await Api.fetchWithAuth(url, method, body, token);
  }, [token, logout]);

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, loading, error, login, logout, fetchWithAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve essere usato dentro AuthProvider');
  return context;
};
