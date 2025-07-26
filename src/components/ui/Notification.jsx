import React from 'react';

const Notification = ({ message, type, onClose }) => {
  if (!message) return null;
  return (
    <div className={`alert alert-${type} alert-dismissible fade show rounded-lg shadow-lg position-fixed bottom-0 end-0 m-4`} role="alert" style={{ zIndex: 1050 }}>
      {message}
      <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
    </div>
  );
};

export default Notification;