
import React, { useState, useEffect, useContext } from 'react';
import { UIContext } from '../../contexts/UIContext';

const ListModal = ({ show, list, onClose, onSave }) => {
  const [name, setName] = useState('');
  const { showNotification } = useContext(UIContext);

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
    onSave({ ...list, name });
    onClose();
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

export default ListModal;