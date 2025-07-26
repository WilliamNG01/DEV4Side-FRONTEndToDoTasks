
import React, { useState, useEffect, useContext } from 'react';
import { DataContext } from '../contexts/DataContext';
import { UIContext } from '../contexts/UIContext';
import ConfirmModal from '../components/modals/ConfirmModal';
import TaskModal from '../components/modals/TaskModal';

const Tasks = () => {
  const { tasks, fetchTasks, addTask, updateTask, deleteTask, lists } = useContext(DataContext);
  const { selectedListId, setCurrentPage, setSelectedListId, showNotification } = useContext(UIContext);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const currentList = lists.find(l => l.id === selectedListId);

  useEffect(() => {
    if (selectedListId) {
      fetchTasks(selectedListId);
    }
  }, [selectedListId, fetchTasks]);

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowTaskModal(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

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

  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
    setShowConfirmModal(true);
  };

  const confirmDeleteTask = async () => {
    try {
      await deleteTask(taskToDelete.id);
      showNotification('Task eliminato con successo!', 'success');
    } catch (error) {
      showNotification(error.message || 'Errore durante l\'eliminazione del task.', 'danger');
    } finally {
      setShowConfirmModal(false);
      setTaskToDelete(null);
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      await updateTask({ ...task, status: newStatus });
      showNotification('Stato del task aggiornato!', 'success');
    } catch (error) {
      showNotification(error.message || 'Errore durante l\'aggiornamento dello stato.', 'danger');
    }
  };

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

      <TaskModal
        show={showTaskModal}
        task={editingTask}
        onClose={() => setShowTaskModal(false)}
        onSave={handleSaveTask}
        lists={lists}
      />
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

export default Tasks;