import React, { createContext, useState, useCallback } from 'react';

// Crea il contesto UI
export const UIContext = createContext(null);

/**
 * Componente Provider per l'UIContext.
 * Gestisce lo stato dell'interfaccia utente, come le notifiche,
 * la pagina corrente e l'ID della lista selezionata.
 * @param {object} { children } - I componenti figli che avranno accesso al contesto.
 */
export const UIProvider = ({ children }) => {
  // Stato per la pagina corrente ('login', 'register', 'lists', 'tasks')
  const [currentPage, setCurrentPage] = useState('login'); // Default alla pagina di login
  // Stato per l'ID della lista selezionata (per la visualizzazione dei task)
  const [selectedListId, setSelectedListId] = useState(null);
  // Stato per le notifiche (messaggio e tipo)
  const [notification, setNotification] = useState({ message: '', type: '' });

  /**
   * Mostra una notifica temporanea.
   * @param {string} message - Il messaggio da visualizzare.
   * @param {'success'|'danger'|'warning'|'info'} type - Il tipo di notifica per lo stile.
   */
  const showNotification = useCallback((message, type) => {
    setNotification({ message, type });
    // Nasconde la notifica dopo 5 secondi
    const timer = setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 5000);
    return () => clearTimeout(timer); // Cleanup del timer
  }, []);

  // Funzione per chiudere manualmente la notifica
  const closeNotification = useCallback(() => {
    setNotification({ message: '', type: '' });
  }, []);

  // Il valore che verrà fornito a tutti i consumatori del contesto
  const uiContextValue = {
    //currentPage,
    //setCurrentPage,
    selectedListId,
    setSelectedListId,
    notification,
    showNotification,
    closeNotification,
  };

  return (
    <UIContext.Provider value={uiContextValue}>
      {children}
    </UIContext.Provider>
  );
};