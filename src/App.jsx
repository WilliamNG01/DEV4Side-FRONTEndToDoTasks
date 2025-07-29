import React, { useState, useEffect, useCallback } from 'react';
// Rimuovi BrowserRouter da qui, dovrebbe essere solo in main.jsx
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';

import { AuthContext } from './contexts/AuthContext';
import { DataContext } from './contexts/DataContext';
import { UIContext } from './contexts/UIContext';
import Api from './api/apiService.js';
import Header from './components/ui/Header';
import Notification from './components/ui/Notification';
import Login from './pages/Login';
import Lists from './pages/Lists';
import Tasks from './pages/Tasks';
import RegistrationForm from './pages/RegistrationForm';
import HomePage from './pages/HomePage';

// Componente Wrapper per le rotte private
const PrivateRoute = ({ children }) => {
  const { token } = React.useContext(AuthContext);
  // Usa React.useContext per chiarezza, anche se useContext è già importato
  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('jwt_token'));
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState([]);
  // Rimuovi completamente `currentPage`
  // const [currentPage, setCurrentPage] = useState(token ? 'home' : 'login');
  const [selectedListId, setSelectedListId] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '' });

  // Inizializza useNavigate qui, all'inizio del componente App
  const navigate = useNavigate(); // <-- Questo è corretto!

  const showNotification = useCallback((message, type) => {
    setNotification({ message, type });
    const timer = setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const login = useCallback(async (usernameoremail, password) => {
    try {
      // Inserisci qui il blocco try-catch completo per la chiamata API
      // per catturare errori di rete o credenziali non valide
      const fetchedToken = await Api.login({ usernameoremail, password });
      setToken(fetchedToken);
      // Il localStorage.setItem('jwt_token', fetchedToken); è già gestito da useEffect in AuthContext,
      // ma puoi lasciarlo qui per ridondanza se preferisci.
      localStorage.setItem('jwt_token', fetchedToken);
      showNotification('Accesso effettuato con successo!', 'success');
      navigate('/home'); // <-- Usa navigate per il reindirizzamento
    } catch (error) {
      showNotification(error.message || 'Credenziali non valide.', 'danger');
    }
  }, [navigate, showNotification]); // Aggiungi navigate alle dipendenze

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('jwt_token'); // Già gestito dall'useEffect in AuthContext
    setLists([]);
    setTasks([]);
    setSelectedListId(null);
    // Rimuovi setCurrentPage('login');
    showNotification('Logout effettuato con successo.', 'info');
    navigate('/login'); // <-- Usa navigate per il reindirizzamento al logout
  }, [setLists, setTasks, setSelectedListId, showNotification, navigate]);

  const fetchLists = useCallback(async () => {
    if (!token) return;
    try {
      const data = await Api.fetchWithAuth('/lists', 'GET', null, token);
      setLists(data);
    } catch (error) {
      showNotification(error.message, 'danger');
      if (error.message.includes('Non autorizzato')) logout();
    }
  }, [token, logout, showNotification]);

  const addList = useCallback(async (list) => {
    if (!token) return;
    try {
      const newList = await Api.fetchWithAuth('/lists', 'POST', list, token);
      setLists((prev) => [...prev, newList]);
    } catch (error) {
      showNotification(error.message, 'danger');
      if (error.message.includes('Non autorizzato')) logout();
      throw error;
    }
  }, [token, logout, showNotification]);

  const updateList = useCallback(async (list) => {
    if (!token) return;
    try {
      await Api.fetchWithAuth(`/lists/${list.id}`, 'PUT', list, token);
      setLists((prev) => prev.map((l) => (l.id === list.id ? list : l)));
    } catch (error) {
      showNotification(error.message, 'danger');
      if (error.message.includes('Non autorizzato')) logout();
      throw error;
    }
  }, [token, logout, showNotification]);

  const deleteList = useCallback(async (id) => {
    if (!token) return;
    try {
      await Api.fetchWithAuth(`/lists/${id}`, 'DELETE', null, token);
      setLists((prev) => prev.filter((l) => l.id !== id));
      if (selectedListId === id) {
        setSelectedListId(null);
        // Rimuovi setCurrentPage('lists');
        navigate('/lists'); // Reindirizza a /lists dopo aver cancellato la lista corrente
      }
    } catch (error) {
      showNotification(error.message, 'danger');
      if (error.message.includes('Non autorizzato')) logout();
      throw error;
    }
  }, [token, selectedListId, logout, showNotification, navigate]); // Aggiungi navigate

  const fetchTasks = useCallback(async (listId) => {
    if (!token || !listId) return;
    try {
      const data = await Api.fetchWithAuth(`/tasks?listId=${listId}`, 'GET', null, token);
      setTasks(data);
    } catch (error) {
      showNotification(error.message, 'danger');
      if (error.message.includes('Non autorizzato')) logout();
    }
  }, [token, logout, showNotification]);

  const addTask = useCallback(async (task) => {
    if (!token) return;
    try {
      const newTask = await Api.fetchWithAuth('/tasks', 'POST', task, token);
      setTasks((prev) => [...prev, newTask]);
    } catch (error) {
      showNotification(error.message, 'danger');
      if (error.message.includes('Non autorizzato')) logout();
      throw error;
    }
  }, [token, logout, showNotification]);

  const updateTask = useCallback(async (task) => {
    if (!token) return;
    try {
      await Api.fetchWithAuth(`/tasks/${task.id}`, 'PUT', task, token);
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    } catch (error) {
      showNotification(error.message, 'danger');
      if (error.message.includes('Non autorizzato')) logout();
      throw error;
    }
  }, [token, logout, showNotification]);

  const deleteTask = useCallback(async (id) => {
    if (!token) return;
    try {
      await Api.fetchWithAuth(`/tasks/${id}`, 'DELETE', null, token);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      showNotification(error.message, 'danger');
      if (error.message.includes('Non autorizzato')) logout();
      throw error;
    }
  }, [token, logout, showNotification]);

  // Questo useEffect ora reagisce solo al token
  // La navigazione è gestita dal router
  useEffect(() => {
    if (token) {
      // Rimuovi setCurrentPage('lists');
      fetchLists();
    } else {
      // Rimuovi setCurrentPage('login');
      // Il reindirizzamento al login è già gestito dalle PrivateRoute o dalla rotta '/'
    }
    // Se il token diventa null (es. logout), il PrivateRoute reindirizzerà a /login
  }, [token, fetchLists]); // Rimuovi setCurrentPage dalle dipendenze

  // Rimuovi completamente la funzione renderPage
  // const renderPage = () => {
  //   switch (currentPage) {
  //     case 'home':
  //       return <HomePage />;
  //     case 'login':
  //       return <Login />;
  //     case 'register':
  //       return <RegistrationForm />;
  //     case 'lists':
  //       return <Lists />;
  //     case 'tasks':
  //       return <Tasks />;
  //     default:
  //       return <HomePage />;
  //   }
  // };

  return (
    <>
      {/* Questi link e stili CSS statici dovrebbero essere importati/gestiti in modo più React-friendly */}
      {/* Ad esempio, con un file CSS esterno o con un'utility come `react-helmet` per i link */}
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" crossOrigin="anonymous"></link>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"></link>

      <style>
        {`
          body {
            font-family: 'Inter', sans-serif;
            background-color: #f8f9fa;
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
            filter: invert(1) grayscale(100%) brightness(200%);
          }
          .alert {
            z-index: 1050;
          }
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

      {/* Rimuovi <BrowserRouter> da qui, l'abbiamo spostato in main.jsx */}
      <AuthContext.Provider value={{ token, login, logout }}>
        <UIContext.Provider value={{ selectedListId, setSelectedListId, notification, showNotification }}>
          <DataContext.Provider value={{
            lists, tasks,
            fetchLists, addList, updateList, deleteList,
            fetchTasks, addTask, updateTask, deleteTask
          }}>
            <Header />
            <main className="flex-grow-1">
              <Routes> {/* Qui definiamo le rotte */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegistrationForm />} />

                {/* Rotta di default per utenti non autenticati o root */}
                <Route path="/" element={token ? <Navigate to="/home" replace /> : <Login />} />

                {/* Rotte protette (solo se l'utente è loggato) */}
                <Route path="/home" element={<HomePage />} />
                <Route path="/lists" element={<PrivateRoute><Lists /></PrivateRoute>} />
                {/* Rotta per i task con un parametro ID della lista */}
                <Route path="/tasks/:listId" element={<PrivateRoute><Tasks /></PrivateRoute>} />

                {/* Catch-all per rotte non trovate, reindirizza alla home o al login */}
                <Route path="*" element={token ? <Navigate to="/home" replace /> : <Login />} />
              </Routes>
            </main>
            <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '' })} />
          </DataContext.Provider>
        </UIContext.Provider>
      </AuthContext.Provider>

      {/* Questo script dovrebbe essere nel tuo index.html o gestito in modo diverso in React */}
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" crossOrigin="anonymous"></script>
    </>
  );
}