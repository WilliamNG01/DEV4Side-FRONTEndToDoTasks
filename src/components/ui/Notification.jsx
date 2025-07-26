/**
 * Componente per visualizzare notifiche temporanee.
 * @param {object} props - Le proprietà del componente.
 * @param {string} props.message - Il messaggio della notifica.
 * @param {'success'|'danger'|'warning'|'info'} props.type - Il tipo di notifica per lo stile.
 * @param {function} props.onClose - Funzione per chiudere la notifica.
 */
const Notification = ({ message, type, onClose }) => {
  if (!message) return null;
  return (
    <div className={`alert alert-${type} alert-dismissible fade show rounded-lg shadow-lg position-fixed bottom-0 end-0 m-4`} role="alert" style={{ zIndex: 1050 }}>
      {message}
      <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
    </div>
  );
};

