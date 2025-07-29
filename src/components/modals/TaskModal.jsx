import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom'; // Importa useParams
import { UIContext } from '../../contexts/UIContext'; // Importa UIContext

const TaskModal = ({ show, task, onClose, onSave, lists }) => {
  const { listId: currentListIdFromUrl } = useParams(); // Ottieni l'ID della lista corrente dall'URL
  const { showNotification } = useContext(UIContext);

  // Stati del form per il task
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('Da fare');
  const [selectedListId, setSelectedListId] = useState(''); // Usa un nome diverso per lo stato del form

  // useEffect per inizializzare gli stati del form quando il modal si apre o il task cambia
  useEffect(() => {
    if (show) {
      if (task) {
        // Modal per modifica task esistente
        setTitle(task.title || '');
        setDescription(task.description || '');
        // Assicurati che dueDate sia nel formato corretto per input type="datetime-local"
        setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '');
        setStatus(task.status || 'Da fare');
        setSelectedListId(task.listId || ''); // Usa l'ID della lista del task esistente
      } else {
        // Modal per creazione nuovo task
        setTitle('');
        setDescription('');
        setDueDate('');
        setStatus('Da fare');
        // Imposta l'ID della lista predefinita:
        // 1. L'ID dalla URL se presente (siamo sulla pagina dei task di una lista specifica)
        // 2. Il primo ID della lista disponibile se ci sono liste
        // 3. Stringa vuota se non ci sono liste
        setSelectedListId(currentListIdFromUrl || (lists.length > 0 ? lists[0].id : ''));
      }
    }
  }, [show, task, lists, currentListIdFromUrl]); // Aggiungi currentListIdFromUrl alle dipendenze

  // Funzione per riordinare le liste in modo che quella corrente sia in cima
  const getOrderedLists = () => {
    if (!lists || lists.length === 0) return [];

    // L'ID della lista attiva è quello selezionato nel form o quello dalla URL
    const activeListId = selectedListId || currentListIdFromUrl;
    const currentList = lists.find(l => l.id === activeListId);

    if (currentList) {
      // Filtra le altre liste e crea un nuovo array con la lista corrente in cima
      const otherLists = lists.filter(l => l.id !== activeListId);
      return [currentList, ...otherLists];
    }
    return lists; // Restituisce l'ordine originale se nessuna lista corrente o non trovata
  };

  const orderedLists = getOrderedLists(); // Ottieni le liste ordinate

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !selectedListId) { // Usa selectedListId qui
      showNotification('Titolo e Lista sono campi obbligatori.', 'warning');
      return;
    }

    onSave({
      ...task, // Mantieni l'ID se è un task esistente
      title,
      description,
      // Converte la data in formato ISO stringa solo se è stata fornita
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      status,
      listId: selectedListId, // Invia selectedListId
    });
    onClose();
  };

  if (!show) return null; // Non renderizzare il modal se show è false

  return (
    <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content rounded-lg shadow-lg">
          <div className="modal-header bg-success text-white rounded-top-lg">
            <h5 className="modal-title">{task ? 'Modifica Task' : 'Crea Nuovo Task'}</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Campo Titolo */}
              <div className="form-group mb-3">
                <label htmlFor="taskTitle">Titolo</label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  id="taskTitle"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              {/* Campo Descrizione */}
              <div className="form-group mb-3">
                <label htmlFor="taskDescription">Descrizione</label>
                <textarea
                  className="form-control rounded-lg"
                  id="taskDescription"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              {/* Campo Data di Scadenza */}
              <div className="form-group mb-3">
                <label htmlFor="taskDueDate">Data e Ora di Scadenza</label>
                <input
                  type="datetime-local" // Importante per data e ora
                  className="form-control rounded-pill"
                  id="taskDueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              {/* Campo Stato */}
              <div className="form-group mb-3">
                <label htmlFor="taskStatus">Stato</label>
                <select
                  className="form-control rounded-pill"
                  id="taskStatus"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Da fare">Da fare</option>
                  <option value="In corso">In corso</option>
                  <option value="Completato">Completato</option>
                </select>
              </div>
              {/* Campo Lista (il dropdown modificato) */}
              <div className="form-group mb-3">
                <label htmlFor="taskList">Lista</label>
                <select
                  className="form-control rounded-pill"
                  id="taskList"
                  value={selectedListId} // Usa selectedListId
                  onChange={(e) => setSelectedListId(e.target.value)} // Aggiorna selectedListId
                  required
                >
                  <option value="">Seleziona una lista</option>
                  {orderedLists.map((list) => ( // Mappa le liste ordinate
                    <option key={list.id} value={list.id}>
                      {list.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={onClose}>Annulla</button>
              <button type="submit" className="btn btn-success rounded-pill px-4">Salva</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;