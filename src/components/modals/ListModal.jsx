/**
 * Componente modale per la creazione o modifica di una lista.
 * @param {object} props - Le proprietà del componente.
 * @param {boolean} props.show - Indica se il modale deve essere mostrato.
 * @param {object|null} props.list - L'oggetto lista da modificare (null per la creazione).
 * @param {function} props.onClose - Funzione per chiudere il modale.
 * @param {function} props.onSave - Funzione per salvare la lista.
 */
const ListModal = ({ show, list, onClose, onSave }) => {
  const [name, setName] = useState('');
  const { showNotification } = useContext(UIContext);

  // Imposta il nome della lista quando il modale viene mostrato o la lista cambia.
  useEffect(() => {
    if (show) {
      setName(list ? list.name : '');
    }
  }, [show, list]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showNotification('Il nome della lista non può essere vuoto.', 'warning');
      return;
    }
    onSave({ ...list, name }); // Passa l'oggetto lista con il nome aggiornato.
    onClose(); // Chiudi il modale dopo il salvataggio.
  };

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content rounded-lg shadow-lg">
          <div className="modal-header bg-primary text-white rounded-top-lg">
            <h5 className="modal-title">{list ? 'Modifica Lista' : 'Crea Nuova Lista'}</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="listName">Nome Lista</label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  id="listName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={onClose}>Annulla</button>
              <button type="submit" className="btn btn-primary rounded-pill px-4">Salva</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
