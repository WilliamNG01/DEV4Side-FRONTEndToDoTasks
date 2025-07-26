/**
 * Componente per la visualizzazione e gestione dei task di una lista selezionata.
 */
const Tasks = () => {
  const { tasks, fetchTasks, addTask, updateTask, deleteTask, lists } = useContext(DataContext);
  const { selectedListId, setCurrentPage, setSelectedListId, showNotification } = useContext(UIContext);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // Task da modificare nel modale
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null); // Task da eliminare

  // Trova la lista corrente basandosi su selectedListId.
  const currentList = lists.find(l => l.id === selectedListId);

  // Carica i task della lista selezionata all'avvio o al cambio di selectedListId.
  useEffect(() => {
    if (selectedListId) {
      fetchTasks(selectedListId);
    }
  }, [selectedListId, fetchTasks]);

  // Gestore per aprire il modale di creazione task.
  const handleCreateTask = () => {
    setEditingTask(null); // Nessun task in modifica
    setShowTaskModal(true);
  };

  // Gestore per aprire il modale di modifica task.
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  // Gestore per salvare un task (creazione o modifica).
  const handleSaveTask = async (task) => {
    try {
      if (task.id) {
        await updateTask(task);
        showNotification('Task aggiornato con successo!', 'success');
      } else {
        await addTask(task);
        showNotification('Task creato con successo!', 'success');
      }
    } catch (error) {
      showNotification(error.message || 'Errore durante il salvataggio del task.', 'danger');
    }
  };

  // Gestore per preparare l'eliminazione di un task (mostra modale di conferma).
  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
    setShowConfirmModal(true);
  };

  // Funzione di conferma per l'eliminazione effettiva del task.
  const confirmDeleteTask = async () => {
    try {
      await deleteTask(taskToDelete.id);
      showNotification('Task eliminato con successo!', 'success');
    } catch (error) {
      showNotification(error.message || 'Errore durante l\'eliminazione del task.', 'danger');
    } finally {
      // Resetta lo stato del modale di conferma.
      setShowConfirmModal(false);
      setTaskToDelete(null);
    }
  };

  // Gestore per cambiare lo stato di un task.
  const handleStatusChange = async (task, newStatus) => {
    try {
      await updateTask({ ...task, status: newStatus });
      showNotification('Stato del task aggiornato!', 'success');
    } catch (error) {
      showNotification(error.message || 'Errore durante l\'aggiornamento dello stato.', 'danger');
    }
  };

  // Funzione helper per ottenere la classe CSS del badge in base allo stato del task.
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Da fare': return 'bg-secondary';
      case 'In corso': return 'bg-warning text-dark';
      case 'Completato': return 'bg-success';
      default: return 'bg-light text-dark';
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-success">Task per "{currentList?.name || 'Lista Sconosciuta'}"</h2>
        <div>
          <button className="btn btn-outline-secondary rounded-pill px-4 me-2" onClick={() => { setSelectedListId(null); setCurrentPage('lists'); }}>
            <i className="bi bi-arrow-left me-2"></i>Torna alle Liste
          </button>
          <button className="btn btn-success rounded-pill px-4" onClick={handleCreateTask}>
            <i className="bi bi-plus-circle me-2"></i>Crea Nuovo Task
          </button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <p className="text-center text-muted">Nessun task trovato per questa lista. Crea il tuo primo task!</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {tasks.map((task) => (
            <div className="col" key={task.id}>
              <div className="card h-100 shadow-sm border-0 rounded-lg">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-truncate">{task.title}</h5>
                  <p className="card-text text-muted mb-2 flex-grow-1">{task.description || 'Nessuna descrizione'}</p>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className={`badge ${getStatusBadgeClass(task.status)} rounded-pill px-3 py-2`}>{task.status}</span>
                    {task.dueDate && (
                      <small className="text-info">Scadenza: {new Date(task.dueDate).toLocaleDateString()}</small>
                    )}
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    {/* Dropdown per il cambio di stato */}
                    <div className="btn-group" role="group">
                      <button
                        id={`dropdownStatus${task.id}`}
                        type="button"
                        className={`btn btn-sm dropdown-toggle ${getStatusBadgeClass(task.status)} rounded-pill`}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Cambia Stato
                      </button>
                      <ul className="dropdown-menu" aria-labelledby={`dropdownStatus${task.id}`}>
                        <li><a className="dropdown-item" href="#" onClick={() => handleStatusChange(task, 'Da fare')}>Da fare</a></li>
                        <li><a className="dropdown-item" href="#" onClick={() => handleStatusChange(task, 'In corso')}>In corso</a></li>
                        <li><a className="dropdown-item" href="#" onClick={() => handleStatusChange(task, 'Completato')}>Completato</a></li>
                      </ul>
                    </div>
                    {/* Pulsanti di modifica ed eliminazione task */}
                    <div>
                      <button className="btn btn-sm btn-outline-warning rounded-pill me-2" onClick={() => handleEditTask(task)}>
                        <i className="bi bi-pencil"></i> Modifica
                      </button>
                      <button className="btn btn-sm btn-outline-danger rounded-pill" onClick={() => handleDeleteTask(task)}>
                        <i className="bi bi-trash"></i> Elimina
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modale per creazione/modifica task */}
      <TaskModal
        show={showTaskModal}
        task={editingTask}
        onClose={() => setShowTaskModal(false)}
        onSave={handleSaveTask}
        lists={lists} // Passa le liste per la selezione nel modale del task
      />
      {/* Modale di conferma eliminazione task */}
      <ConfirmModal
        show={showConfirmModal}
        title="Conferma Eliminazione Task"
        message={`Sei sicuro di voler eliminare il task "${taskToDelete?.title}"?`}
        onConfirm={confirmDeleteTask}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
};
