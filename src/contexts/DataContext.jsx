import React, { createContext, useState, useCallback, useContext } from 'react';
import { AuthContext } from './AuthContext.jsx'; // Importa AuthContext per usare fetchWithAuth

// Crea il contesto per i dati (liste e task)
export const DataContext = createContext(null);

/**
 * Componente Provider per il DataContext.
 * Gestisce lo stato delle liste e dei task, e le relative operazioni CRUD con l'API.
 * @param {object} { children } - I componenti figli che avranno accesso al contesto.
 */
export const DataProvider = ({ children }) => {
  // Stati per liste e task
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState([]);
  // Ottieni la funzione fetchWithAuth e logout dal contesto di autenticazione
  const { fetchWithAuth, logout } = useContext(AuthContext);

  // Nota: UIContext non viene importato direttamente qui per evitare dipendenze circolari
  // Le notifiche dovrebbero essere gestite nel componente che chiama le funzioni del DataContext.
  // Tuttavia, per semplicità e per coerenza con l'esempio consolidato precedente,
  // se UIContext è disponibile globalmente o tramite un altro provider superiore,
  // potresti passarlo qui o gestire le notifiche a un livello più alto.

  /**
   * Recupera tutte le liste dal backend.
   */
  const fetchLists = useCallback(async () => {
    try {
      const data = await fetchWithAuth('/lists', 'GET');
      setLists(data);
    } catch (error) {
      console.error('Errore durante il recupero delle liste:', error);
      // La gestione specifica dell'errore (es. notifica) dovrebbe essere fatta nel componente che chiama
      // o in un contesto di UI più generale. fetchWithAuth gestisce già il logout per 401/403.
    }
  }, [fetchWithAuth]);

  /**
   * Aggiunge una nuova lista al backend.
   * @param {object} list - L'oggetto lista da aggiungere (es. { name: "Nuova Lista" }).
   */
  const addList = useCallback(async (list) => {
    try {
      const newList = await fetchWithAuth('/lists', 'POST', list);
      setLists((prev) => [...prev, newList]);
      return newList; // Restituisce la nuova lista creata
    } catch (error) {
      console.error('Errore durante l\'aggiunta della lista:', error);
      throw error; // Rilancia l'errore per la gestione nel componente chiamante
    }
  }, [fetchWithAuth]);

  /**
   * Aggiorna una lista esistente nel backend.
   * @param {object} list - L'oggetto lista aggiornato (deve contenere l'ID).
   */
  const updateList = useCallback(async (list) => {
    try {
      await fetchWithAuth(`/lists/${list.id}`, 'PUT', list);
      setLists((prev) => prev.map((l) => (l.id === list.id ? list : l)));
    } catch (error) {
      console.error('Errore durante l\'aggiornamento della lista:', error);
      throw error;
    }
  }, [fetchWithAuth]);

  /**
   * Elimina una lista dal backend.
   * @param {string} id - L'ID della lista da eliminare.
   */
  const deleteList = useCallback(async (id) => {
    try {
      await fetchWithAuth(`/lists/${id}`, 'DELETE');
      setLists((prev) => prev.filter((l) => l.id !== id));
    } catch (error) {
      console.error('Errore durante l\'eliminazione della lista:', error);
      throw error;
    }
  }, [fetchWithAuth]);

  /**
   * Recupera i task per una specifica lista dal backend.
   * @param {string} listId - L'ID della lista di cui recuperare i task.
   */
  const fetchTasks = useCallback(async (listId) => {
    try {
      const data = await fetchWithAuth(`/tasks?listId=${listId}`, 'GET');
      setTasks(data);
    } catch (error) {
      console.error('Errore durante il recupero dei task:', error);
    }
  }, [fetchWithAuth]);

  /**
   * Aggiunge un nuovo task al backend.
   * @param {object} task - L'oggetto task da aggiungere.
   */
  const addTask = useCallback(async (task) => {
    try {
      const newTask = await fetchWithAuth('/tasks', 'POST', task);
      setTasks((prev) => [...prev, newTask]);
      return newTask;
    } catch (error) {
      console.error('Errore durante l\'aggiunta del task:', error);
      throw error;
    }
  }, [fetchWithAuth]);

  /**
   * Aggiorna un task esistente nel backend.
   * @param {object} task - L'oggetto task aggiornato (deve contenere l'ID).
   */
  const updateTask = useCallback(async (task) => {
    try {
      await fetchWithAuth(`/tasks/${task.id}`, 'PUT', task);
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    } catch (error) {
      console.error('Errore durante l\'aggiornamento del task:', error);
      throw error;
    }
  }, [fetchWithAuth]);

  /**
   * Elimina un task dal backend.
   * @param {string} id - L'ID del task da eliminare.
   */
  const deleteTask = useCallback(async (id) => {
    try {
      await fetchWithAuth(`/tasks/${id}`, 'DELETE');
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Errore durante l\'eliminazione del task:', error);
      throw error;
    }
  }, [fetchWithAuth]);

  // Il valore che verrà fornito a tutti i consumatori del contesto
  const dataContextValue = {
    lists,
    tasks,
    fetchLists,
    addList,
    updateList,
    deleteList,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
  };

  return (
    <DataContext.Provider value={dataContextValue}>
      {children}
    </DataContext.Provider>
  );
};