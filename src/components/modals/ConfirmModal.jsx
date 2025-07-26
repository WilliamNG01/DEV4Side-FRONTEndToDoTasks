/**
 * Componente modale di conferma generico.
 * @param {object} props - Le proprietà del componente.
 * @param {boolean} props.show - Indica se il modale deve essere mostrato.
 * @param {string} props.title - Il titolo del modale.
 * @param {string} props.message - Il messaggio da visualizzare nel modale.
 * @param {function} props.onConfirm - Funzione da chiamare alla conferma.
 * @param {function} props.onCancel - Funzione da chiamare all'annullamento.
 */
const ConfirmModal = ({ show, title, message, onConfirm, onCancel }) => {
  if (!show) return null;
  return (
    <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content rounded-lg shadow-lg">
          <div className="modal-header bg-danger text-white rounded-top-lg">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onCancel} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={onCancel}>Annulla</button>
            <button type="button" className="btn btn-danger rounded-pill px-4" onClick={onConfirm}>Conferma</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ConfirmModal;