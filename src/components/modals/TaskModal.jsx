/**
 * Componente modale per la creazione o modifica di un task.
 * @param {object} props - Le proprietà del componente.
 * @param {boolean} props.show - Indica se il modale deve essere mostrato.
 * @param {object|null} props.task - L'oggetto task da modificare (null per la creazione).
 * @param {function} props.onClose - Funzione per chiudere il modale.
 * @param {function} props.onSave - Funzione per salvare il task.
 * @param {array} props.lists - Array di tutte le liste disponibili per selezionare la lista del task.
 */
const TaskModal = ({ show, task, onClose, onSave, lists }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('Da fare');
  const [listId, setListId] = useState('');
  const { showNotification } = useContext(UIContext);

  // Imposta i campi del task quando il modale viene mostrato o il task/liste cambiano.
  useEffect(() => {
    if (show) {
      if (task) {
        setTitle(task.title);
        setDescription(task.description);
        // Formatta la data per l'input type="date"
        setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
        setStatus(task.status);
        setListId(task.listId);
      } else {
        // Valori di default per un nuovo task
        setTitle('');
        setDescription('');
        setDueDate('');
        setStatus('Da fare');
        setListId(lists.length > 0 ? lists[0].id : ''); // Seleziona la prima lista di default
      }
    }
  }, [show, task, lists]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !listId) {
      showNotification('Titolo e Lista sono campi obbligatori.', 'warning');
      return;
    }
    onSave({
      ...task, // Mantiene l'ID se è una modifica
      title,
      description,
      // Converte la data in formato ISO string per il backend
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      status,
      listId,
    });
    onClose();
  };

  if (!show) return null;

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
              <div className="form-group mb-3">
                <label htmlFor="taskDueDate">Data di Scadenza</label>
                <input
                  type="date"
                  className="form-control rounded-pill"
                  id="taskDueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
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
              <div className="form-group mb-3">
                <label htmlFor="taskList">Lista</label>
                <select
                  className="form-control rounded-pill"
                  id="taskList"
                  value={listId}
                  onChange={(e) => setListId(e.target.value)}
                  required
                >
                  <option value="">Seleziona una lista</option>
                  {lists.map((list) => (
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
