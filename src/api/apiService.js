import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';

// --- Contesti React per la gestione dello stato globale ---
// AuthContext: Gestisce lo stato di autenticazione (token JWT).
const AuthContext = createContext(null);
// DataContext: Gestisce i dati delle liste e dei task.
const DataContext = createContext(null);
// UIContext: Gestisce lo stato dell'interfaccia utente, come la pagina corrente e le notifiche.
const UIContext = createContext(null);

// --- Servizio API per le chiamate al backend ---
// Sostituisci questo URL con l'indirizzo del tuo backend API .NET 8.
const API_BASE_URL = 'https://webapitodolist20250728153145.azurewebsites.net'; 

const Api = {
  /**
   * Effettua una richiesta di login al backend.
   * @param {object} credentials - Oggetto contenente username e password.
   * @returns {Promise<string>} Il token JWT ricevuto dal backend.
   * @throws {Error} Se il login fallisce.
   */
  async login(credentials) {
    try {
      // Assumiamo un endpoint di login come /auth/login che ritorna un token JWT.
      const response = await fetch(`${API_BASE_URL}/auth/login`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login fallito. Verifica le credenziali.');
      }
      const data = await response.json();
      return data.token; // Assumiamo che la risposta contenga una proprietà 'token'.
    } catch (error) {
      console.error('Errore durante il login:', error);
      throw error;
    }
  },

  /**
   * Effettua una richiesta API autenticata al backend.
   * @param {string} url - Il percorso dell'API (es. '/lists').
   * @param {string} method - Il metodo HTTP (GET, POST, PUT, DELETE).
   * @param {object|null} body - Il corpo della richiesta per POST/PUT.
   * @param {string} token - Il token JWT per l'autorizzazione.
   * @returns {Promise<object|array>} La risposta JSON dal backend.
   * @throws {Error} Se la richiesta fallisce o non è autorizzata.
   */
  async fetchWithAuth(url, method = 'GET', body = null, token) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Invia il token JWT nell'header Authorization.
    };

    const config = {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, config);
      if (response.status === 401) { // Se la risposta è 401 (Unauthorized), il token potrebbe essere scaduto o non valido.
        throw new Error('Non autorizzato. Effettua nuovamente il login.');
      }
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Errore API: ${response.statusText} (${response.status})`);
      }
      // Se la risposta è 204 No Content (es. per DELETE), non tentare di parsare JSON.
      if (response.status === 204) {
        return {}; 
      }
      return await response.json();
    } catch (error) {
      console.error(`Errore nella richiesta ${method} ${url}:`, error);
      throw error;
    }
  },
};
export default Api;
