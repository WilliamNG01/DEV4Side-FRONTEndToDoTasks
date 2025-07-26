// --- Componente Principale dell'Applicazione ---
export default function App() {
  // Stato per il token JWT, recuperato da localStorage all'avvio.
  const [token, setToken] = useState(localStorage.getItem('jwt_token'));
  // Stati per liste e task.
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState([]);
  // Stato per la pagina corrente ('login', 'lists', 'tasks').
  const [currentPage, setCurrentPage] = useState(token ? 'lists' : 'login'); 
  // Stato per l'ID della lista selezionata (per visualizzare i task).
  const [selectedListId, setSelectedListId] = useState(null);

  // Stato per le notifiche (messaggio e tipo).
  const [notification, setNotification] = useState({ message: '', type: '' });
  
  /**
   * Mostra una notifica temporanea.
   * @param {string} message - Il messaggio da visualizzare.
   * @param {'success'|'danger'|'warning'|'info'} type - Il tipo di notifica.
   */
  const showNotification = useCallback((message, type) => {
    setNotification({ message, type });
    // Nasconde la notifica dopo 5 secondi.
    const timer = setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 5000); 
    return () => clearTimeout(timer); // Cleanup del timer.
  }, []);

  // --- Funzioni per il contesto di Autenticazione ---
  /**
   * Gestisce il processo di login.
   * @param {string} username - Il nome utente.
   * @param {string} password - La password.
   */
  const login = useCallback(async (username, password) => {
    const fetchedToken = await api.login({ username, password });
    setToken(fetchedToken);
    localStorage.setItem('jwt_token', fetchedToken); // Salva il token in localStorage.
    setCurrentPage('lists'); // Naviga alla pagina delle liste dopo il login.
  }, []);

  /**
   * Gestisce il processo di logout.
   */
  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('jwt_token'); // Rimuove il token da localStorage.
    setLists([]); // Pulisce i dati.
    setTasks([]);
    setSelectedListId(null);
    setCurrentPage('login'); // Naviga alla pagina di login.
    showNotification('Logout effettuato con successo.', 'info');
  }, [showNotification]);

  // --- Funzioni per il contesto Dati (API Calls) ---
  /**
   * Recupera tutte le liste dal backend.
   */
  const fetchLists = useCallback(async () => {
    if (!token) return; // Non procedere se non c'è un token.
    try {
      const data = await api.fetchWithAuth('/lists', 'GET', null, token);
      setLists(data);
    } catch (error) {
      showNotification(error.message, 'danger');
      if (error.message.includes('Non autorizzato')) logout(); // Se non autorizzato, forza il logout.
    }
  }, [token, logout, showNotification]);

  /**
   * Aggiunge una nuova lista al backend.
   * @param {object} list - L'oggetto lista da aggiungere.
   */
  const addList = useCallback(async (list) => {
    if (!token) return;
    try {
      const newList = await api.fetchWithAuth('/lists', 'POST', list, token);
      setLists((prev) => [...prev, newList]);
    } catch (error) {
      showNotification(error.message, 'danger');
      if (error.message.includes('Non autorizzato')) logout();
      throw error; // Rilancia l'errore per il gestore del modale.
    }
  }, [token, logout, showNotification]);

  /**
   * Aggiorna una lista esistente nel backend.
   * @param {object} list - L'oggetto lista aggiornato.
   */
  const updateList = useCallback(async (list) => {
    if (!token) return;
    try {
      // Assumiamo che il backend supporti PUT /lists/{id} per l'aggiornamento.
      await api.fetchWithAuth(`/lists/${list.id}`, 'PUT', list, token); 
      setLists((prev) => prev.map((l) => (l.id === list.id ? list : l)));
    } catch (error) {
      showNotification(error.message, 'danger');
      if (error.message.includes('Non autorizzato')) logout();
      throw error;
    }
  }, [token, logout, showNotification]);

  /**
   * Elimina una lista dal backend.
   * @param {string} id - L'ID della lista da eliminare.
   */
  const deleteList = useCallback(async (id) => {
    if (!token) return;
    try {
      await api.fetchWithAuth(`/lists/${id}`, 'DELETE', null, token);
      setLists((prev) => prev.filter((l) => l.id !== id));
      // Se la lista eliminata era quella selezionata, torna alla visualizzazione delle liste.
      if (selectedListId === id) {
        setSelectedListId(null);
        setCurrentPage('lists');
      }
    } catch (error) {
      showNotification(error.message, 'danger');
      if (error.message.includes('Non autorizzato')) logout();
      throw error;
    }
  }, [token, selectedListId, logout, showNotification]);

  /**
   * Recupera i task per una specifica lista dal backend.
   * @param {string} listId - L'ID della lista di cui recuperare i task.
   */
  const fetchTasks = useCallback(async (listId) => {
    if (!token || !listId) return;
    try {
      const data = await api.fetchWithAuth(`/tasks?listId=${listId}`, 'GET', null, token);
      setTasks(data);
    } catch (error) {
      showNotification(error.message, 'danger');
      if (error.message.includes('Non autorizzato')) logout();
    }
  }, [token, logout, showNotification]);

  /**
   * Aggiunge un nuovo task al backend.
   * @param {object} task - L'oggetto task da aggiungere.
   */
  const addTask = useCallback(async (task) => {
    if (!token) return;
    try {
      const newTask = await api.fetchWithAuth('/tasks', 'POST', task, token);
      setTasks((prev) => [...prev, newTask]);
    } catch (error) {
      showNotification(error.message, 'danger');
      if (error.message.includes('Non autorizzato')) logout();
      throw error;
    }
  }, [token, logout, showNotification]);

  /**
   * Aggiorna un task esistente nel backend.
   * @param {object} task - L'oggetto task aggiornato.
   */
  const updateTask = useCallback(async (task) => {
    if (!token) return;
    try {
      await api.fetchWithAuth(`/tasks/${task.id}`, 'PUT', task, token);
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    } catch (error) {
      showNotification(error.message, 'danger');
      if (error.message.includes('Non autorizzato')) logout();
      throw error;
    }
  }, [token, logout, showNotification]);

  /**
   * Elimina un task dal backend.
   * @param {string} id - L'ID del task da eliminare.
   */
  const deleteTask = useCallback(async (id) => {
    if (!token) return;
    try {
      await api.fetchWithAuth(`/tasks/${id}`, 'DELETE', null, token);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      showNotification(error.message, 'danger');
      if (error.message.includes('Non autorizzato')) logout();
      throw error;
    }
  }, [token, logout, showNotification]);

  // --- Effetto per il controllo iniziale dell'autenticazione ---
  useEffect(() => {
    if (token) {
      setCurrentPage('lists'); // Se c'è un token, vai alla pagina delle liste.
      fetchLists(); // E recupera le liste.
    } else {
      setCurrentPage('login'); // Altrimenti, vai alla pagina di login.
    }
  }, [token, fetchLists]);

  // --- Funzione per il rendering condizionale della pagina ---
  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login />;
      case 'lists':
        return <Lists />;
      case 'tasks':
        return <Tasks />;
      default:
        return <Login />; // Fallback.
    }
  };

  return (
    <>
      {/* CDN di Bootstrap CSS per stili base e responsive */}
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" xintegrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossOrigin="anonymous"></link>
      {/* CDN di Bootstrap Icons per le icone (es. plus-circle, pencil, trash, arrow-left) */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"></link>
      
      {/* Stili CSS personalizzati per arrotondamenti, ombre e colori consistenti */}
      <style>
        {`
          body {
            font-family: 'Inter', sans-serif;
            background-color: #f8f9fa; /* Sfondo chiaro */
          }
          .rounded-pill {
            border-radius: 50rem !important;
          }
          .rounded-lg {
            border-radius: 0.5rem !important;
          }
          .shadow-lg {
            box-shadow: 0 1rem 3rem rgba(0,0,0,.175)!important;
          }
          .shadow-sm {
            box-shadow: 0 .125rem .25rem rgba(0,0,0,.075)!important;
          }
          .btn-block {
            display: block;
            width: 100%;
          }
          /* Stili per i modali per centrarli e renderli visibili */
          .modal.d-block {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }
          .modal-dialog {
            max-width: 500px;
            margin: 1.75rem auto;
          }
          .modal-content {
            border: none;
          }
          .modal-header .btn-close {
            padding: 1rem 1rem;
            margin: -1rem -1rem -1rem auto;
          }
          .btn-close-white {
            filter: invert(1) grayscale(100%) brightness(200%); /* Rende la X bianca */
          }
          .alert {
            z-index: 1050; /* Assicura che le notifiche siano sopra altri elementi */
          }
          /* Override colori Bootstrap per consistenza e personalizzazione */
          .bg-primary { background-color: #007bff !important; }
          .text-primary { color: #007bff !important; }
          .btn-primary {
            background-color: #007bff;
            border-color: #007bff;
            transition: all 0.2s ease-in-out;
          }
          .btn-primary:hover {
            background-color: #0056b3;
            border-color: #0056b3;
          }

          .bg-success { background-color: #28a745 !important; }
          .text-success { color: #28a745 !important; }
          .btn-success {
            background-color: #28a745;
            border-color: #28a745;
            transition: all 0.2s ease-in-out;
          }
          .btn-success:hover {
            background-color: #218838;
            border-color: #218838;
          }

          .bg-warning { background-color: #ffc107 !important; }
          .text-warning { color: #ffc107 !important; }
          .btn-warning {
            background-color: #ffc107;
            border-color: #ffc107;
            transition: all 0.2s ease-in-out;
          }
          .btn-warning:hover {
            background-color: #e0a800;
            border-color: #e0a800;
          }

          .bg-danger { background-color: #dc3545 !important; }
          .text-danger { color: #dc3545 !important; }
          .btn-danger {
            background-color: #dc3545;
            border-color: #dc3545;
            transition: all 0.2s ease-in-out;
          }
          .btn-danger:hover {
            background-color: #c82333;
            border-color: #c82333;
          }

          .bg-info { background-color: #17a2b8 !important; }
          .text-info { color: #17a2b8 !important; }
          .btn-info {
            background-color: #17a2b8;
            border-color: #17a2b8;
            transition: all 0.2s ease-in-out;
          }
          .btn-info:hover {
            background-color: #138496;
            border-color: #138496;
          }

          .bg-secondary { background-color: #6c757d !important; }
          .text-secondary { color: #6c757d !important; }
          .btn-secondary {
            background-color: #6c757d;
            border-color: #6c757d;
            transition: all 0.2s ease-in-out;
          }
          .btn-secondary:hover {
            background-color: #5a6268;
            border-color: #5a6268;
          }

          /* Stili specifici per le card */
          .card {
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
          }
          .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 1rem 3rem rgba(0,0,0,.25)!important;
          }
          .card-title {
            font-weight: 600;
          }
          .card-text {
            font-size: 0.9rem;
          }
        `}
      </style>

      {/* Fornisce i contesti a tutti i componenti figli */}
      <AuthContext.Provider value={{ token, login, logout }}>
        <UIContext.Provider value={{ currentPage, setCurrentPage, selectedListId, setSelectedListId, showNotification }}>
          <DataContext.Provider value={{
            lists, tasks,
            fetchLists, addList, updateList, deleteList,
            fetchTasks, addTask, updateTask, deleteTask
          }}>
            <Header /> {/* Header visibile su tutte le pagine (tranne login) */}
            <main className="flex-grow-1">
              {renderPage()} {/* Rendering condizionale della pagina corrente */}
            </main>
            {/* Notifica visibile in basso a destra */}
            <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '' })} />
          </DataContext.Provider>
        </UIContext.Provider>
      </AuthContext.Provider>

      {/* CDN di Bootstrap JS per funzionalità come dropdown, toggler e modali */}
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" xintegrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossOrigin="anonymous"></script>
    </>
  );
}