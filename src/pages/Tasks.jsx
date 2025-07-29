// src/pages/Tasks.jsx
import React, { useEffect, useContext, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Importa useNavigate per "Torna alle Liste"
import { DataContext } from '../contexts/DataContext';
import { UIContext } from '../contexts/UIContext';
import { AuthContext } from '../contexts/AuthContext';

// Importa i tuoi componenti modali (assicurati che esistano e siano corretti)
import TaskModal from '../components/modals/TaskModal'; // Assicurati che questo percorso sia corretto
import ConfirmModal from '../components/modals/ConfirmModal'; // Assicurati che questo percorso sia corretto


const Tasks = () => {
  const { listId } = useParams();
  const navigate = useNavigate(); // Inizializza useNavigate per il pulsante "Torna alle Liste"

  const { tasks, fetchTasks, addTask, updateTask, deleteTask, lists } = useContext(DataContext);
  const { showNotification, setSelectedListId } = useContext(UIContext); // Ottieni setSelectedListId da UIContext
  const { token } = useContext(AuthContext);

  // Stati per la gestione delle modali e dei task
  const [currentList, setCurrentList] = useState(null); // Per mostrare il nome della lista
  const [showTaskModal, setShowTaskModal] = useState(false); // Controlla la visibilità della modale task
  const [editingTask, setEditingTask] = useState(null); // Task corrente in modifica (se null, è in creazione)
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Controlla la visibilità della modale di conferma
  const [taskToDelete, setTaskToDelete] = useState(null); // Task da eliminare


  // Effetto per caricare i task e trovare il nome della lista quando listId o token cambiano
  useEffect(() => {
    if (listId && token) {
      fetchTasks(listId);
      const list = lists.find(l => l.id === parseInt(listId)); // listId da useParams è una stringa
      setCurrentList(list);
    } else if (!token) {
      showNotification('Non autenticato. Effettua il login.', 'danger');
      // PrivateRoute dovrebbe già reindirizzare
    } else {
      showNotification('Nessuna lista selezionata per visualizzare i compiti.', 'warning');
    }
  }, [listId, token, fetchTasks, lists, showNotification]);


  // Funzione per determinare la classe del badge in base allo stato del task
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completato':
        return 'bg-success';
      case 'In corso':
        return 'bg-warning text-dark'; // Bootstrap usa text-dark per testo su bg-warning
      case 'Da fare':
      default:
        return 'bg-secondary';
    }
  };


  // Gestisce l'apertura della modale per la creazione di un nuovo task
  const handleCreateTask = useCallback(() => {
    setEditingTask(null); // Nessun task in modifica
    setShowTaskModal(true); // Apre la modale
  }, []);

  // Gestisce l'apertura della modale per la modifica di un task esistente
  const handleEditTask = useCallback((task) => {
    setEditingTask(task); // Imposta il task da modificare
    setShowTaskModal(true); // Apre la modale
  }, []);

  // Gestisce il salvataggio di un task (nuovo o modificato) dalla modale
  const handleSaveTask = useCallback(async (taskData) => {
    try {
      if (editingTask) {
        // Aggiorna un task esistente
        await updateTask({ ...editingTask, ...taskData, listId: parseInt(listId) });
        showNotification('Task aggiornato con successo!', 'success');
      } else {
        // Crea un nuovo task
        await addTask({ ...taskData, listId: parseInt(listId) });
        showNotification('Task creato con successo!', 'success');
      }
      setShowTaskModal(false); // Chiude la modale
      setEditingTask(null); // Resetta il task in modifica
    } catch (error) {
      // Le notifiche d'errore sono già gestite da addTask/updateTask in App.jsx
    }
  }, [addTask, updateTask, editingTask, listId, showNotification]);


  // Gestisce l'apertura della modale di conferma eliminazione
  const handleDeleteTask = useCallback((task) => {
    setTaskToDelete(task); // Imposta il task da eliminare
    setShowConfirmModal(true); // Apre la modale di conferma
  }, []);

  // Conferma l'eliminazione del task dopo la conferma nella modale
  const confirmDeleteTask = useCallback(async () => {
    if (taskToDelete) {
      try {
        await deleteTask(taskToDelete.id);
        showNotification('Task eliminato con successo!', 'success');
      } catch (error) {
        // L'errore è già gestito da deleteTask in App.jsx
      } finally {
        setShowConfirmModal(false); // Chiude la modale di conferma
        setTaskToDelete(null); // Resetta il task da eliminare
      }
    }
  }, [deleteTask, taskToDelete, showNotification]);


  // Gestisce il cambio di stato tramite dropdown (sul display della card)
  const handleStatusChange = useCallback(async (task, newStatus) => {
    try {
        await updateTask({ ...task, status: newStatus });
        showNotification(`Stato del task "${task.title}" aggiornato a "${newStatus}"!`, 'info');
    } catch (error) {
        // L'errore è già gestito da updateTask in App.jsx
    }
  }, [updateTask, showNotification]);


  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-success">Task per "{currentList?.name || 'Lista Sconosciuta'}"</h2>
        <div>
          {/* Pulsante per tornare alle liste */}
          <button className="btn btn-outline-secondary rounded-pill px-4 me-2" onClick={() => {
              setSelectedListId(null); // Resetta l'ID della lista selezionata (se usato altrove)
              navigate('/lists'); // Naviga alla pagina delle liste
            }}>
            <i className="bi bi-arrow-left me-2"></i>Torna alle Liste
          </button>
          {/* Pulsante per creare un nuovo task (apre la modale) */}
          <button className="btn btn-success rounded-pill px-4" onClick={handleCreateTask}>
            <i className="bi bi-plus-circle me-2"></i>Crea Nuovo Task
          </button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <p className="text-center text-muted">Nessun task trovato per questa lista. Crea il tuo primo task!</p>
      ) : (
         <div className="card shadow-sm p-4"> {/* Contenitore della lista */}
          <ul className="list-group list-group-flush"> {/* Lista Bootstrap senza bordi tra gli elementi */}
            {tasks.map((task) => (
              <li
                key={task.id}
                className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center py-3"
              >
                {/* Contenuto del task: titolo, descrizione, data */}
                <div className="flex-grow-1 me-md-3 mb-2 mb-md-0">
                  <h5 className="mb-1 text-primary">{task.title}</h5>
                  <p className="text-muted mb-1 small">{task.description || 'Nessuna descrizione'}</p>
                  {task.dueDate && (
                    <small className="text-info">Scadenza: {new Date(task.dueDate).toLocaleDateString()}</small>
                  )}
                </div>

                {/* Stato e pulsanti di azione */}
                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center">
                  {/* Badge e Dropdown per lo stato */}
                  <div className="btn-group me-md-3 mb-2 mb-md-0" role="group">
                    <span className={`badge ${getStatusBadgeClass(task.status)} rounded-pill px-3 py-2 me-2`}>{task.status}</span>
                    <button
                      id={`dropdownStatus${task.id}`}
                      type="button"
                      className={`btn btn-sm btn-outline-secondary dropdown-toggle rounded-pill`}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Cambia Stato
                    </button>
                    <ul className="dropdown-menu" aria-labelledby={`dropdownStatus${task.id}`}>
                      <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); handleStatusChange(task, 'Da fare'); }}>Da fare</a></li>
                      <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); handleStatusChange(task, 'In corso'); }}>In corso</a></li>
                      <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); handleStatusChange(task, 'Completato'); }}>Completato</a></li>
                    </ul>
                  </div>
                  
                  {/* Pulsanti Modifica ed Elimina */}
                  <div>
                    <button className="btn btn-sm btn-outline-warning rounded-pill me-2" onClick={() => handleEditTask(task)}>
                      <i className="bi bi-pencil"></i> Modifica
                    </button>
                    <button className="btn btn-sm btn-outline-danger rounded-pill" onClick={() => handleDeleteTask(task)}>
                      <i className="bi bi-trash"></i> Elimina
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modale per Creazione/Modifica Task */}
      <TaskModal
        show={showTaskModal}
        task={editingTask} // Passa il task se in modalità modifica, altrimenti null per creazione
        onClose={() => setShowTaskModal(false)}
        onSave={handleSaveTask}
        lists={lists} // Potrebbe servire a TaskModal se devi cambiare la lista di appartenenza del task
        currentListId={parseInt(listId)} // Passa l'ID della lista corrente alla modale
      />
      
      {/* Modale di Conferma Eliminazione */}
      <ConfirmModal
        show={showConfirmModal}
        title="Conferma Eliminazione Task"
        message={`Sei sicuro di voler eliminare il task "${taskToDelete?.title || ''}"?`}
        onConfirm={confirmDeleteTask}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
};

export default Tasks;