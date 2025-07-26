/**
 * Componente per la visualizzazione e gestione delle liste.
 */
const Lists = () => {
  const { lists, fetchLists, addList, updateList, deleteList } = useContext(DataContext);
  const { setCurrentPage, setSelectedListId, showNotification } = useContext(UIContext);

  const [showListModal, setShowListModal] = useState(false);
  const [editingList, setEditingList] = useState(null); // Lista da modificare nel modale
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [listToDelete, setListToDelete] = useState(null); // Lista da eliminare

  // Carica le liste all'avvio del componente.
  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  // Gestore per visualizzare i task di una lista selezionata.
  const handleViewTasks = (listId) => {
    setSelectedListId(listId);
    setCurrentPage('tasks');
  };

  // Gestore per aprire il modale di creazione lista.
  const handleCreateList = () => {
    setEditingList(null); // Nessuna lista in modifica
    setShowListModal(true);
  };

  // Gestore per aprire il modale di modifica lista.
  const handleEditList = (list) => {
    setEditingList(list);
    setShowListModal(true);
  };

  // Gestore per salvare una lista (creazione o modifica).
  const handleSaveList = async (list) => {
    try {
      if (list.id) {
        await updateList(list);
        showNotification('Lista aggiornata con successo!', 'success');
      } else {
        await addList(list);
        showNotification('Lista creata con successo!', 'success');
      }
    } catch (error) {
      showNotification(error.message || 'Errore durante il salvataggio della lista.', 'danger');
    }
  };

  // Gestore per preparare l'eliminazione di una lista (mostra modale di conferma).
  const handleDeleteList = (list) => {
    setListToDelete(list);
    setShowConfirmModal(true);
  };

  // Funzione di conferma per l'eliminazione effettiva della lista.
  const confirmDeleteList = async () => {
    try {
      await deleteList(listToDelete.id);
      showNotification('Lista eliminata con successo!', 'success');
    } catch (error) {
      showNotification(error.message || 'Errore durante l\'eliminazione della lista.', 'danger');
    } finally {
      // Resetta lo stato del modale di conferma.
      setShowConfirmModal(false);
      setListToDelete(null);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">Le Tue Liste</h2>
        <button className="btn btn-primary rounded-pill px-4" onClick={handleCreateList}>
          <i className="bi bi-plus-circle me-2"></i>Crea Nuova Lista
        </button>
      </div>

      {lists.length === 0 ? (
        <p className="text-center text-muted">Nessuna lista trovata. Crea la tua prima lista!</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {lists.map((list) => (
            <div className="col" key={list.id}>
              <div className="card h-100 shadow-sm border-0 rounded-lg">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-truncate mb-3">{list.name}</h5>
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <button className="btn btn-sm btn-outline-info rounded-pill px-3" onClick={() => handleViewTasks(list.id)}>
                      Visualizza Task
                    </button>
                    <div>
                      <button className="btn btn-sm btn-outline-warning rounded-pill me-2" onClick={() => handleEditList(list)}>
                        <i className="bi bi-pencil"></i> Modifica
                      </button>
                      <button className="btn btn-sm btn-outline-danger rounded-pill" onClick={() => handleDeleteList(list)}>
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

      {/* Modale per creazione/modifica lista */}
      <ListModal
        show={showListModal}
        list={editingList}
        onClose={() => setShowListModal(false)}
        onSave={handleSaveList}
      />
      {/* Modale di conferma eliminazione lista */}
      <ConfirmModal
        show={showConfirmModal}
        title="Conferma Eliminazione Lista"
        message={`Sei sicuro di voler eliminare la lista "${listToDelete?.name}"? Tutti i task associati verranno eliminati.`}
        onConfirm={confirmDeleteList}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
};