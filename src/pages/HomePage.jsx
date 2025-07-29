// src/pages/HomePage.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
//import { UIContext } from '../contexts/UIContext';
import { AuthContext } from '../contexts/AuthContext';

function HomePage() {
   const navigate = useNavigate(); // Inizializza useNavigate
  const { token } = useContext(AuthContext);

  return (
    <div className="container mt-5 text-center">
      <h1 className="mb-4">Benvenuto nella tua App per la gestione delle Liste!</h1>
      <p className="lead">Organizza i tuoi impegni e non dimenticare mai più nulla.</p>
      <div className="d-grid gap-2 col-md-6 mx-auto mt-4">
        {/* Pulsante per navigare alla pagina "Lists" */}
        {token && (<button className="btn btn-primary btn-lg" onClick={() => navigate('/lists')}>
          Vai alle Mie Liste
        </button>
        )}
        {!token && (<button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>
          Vai alle Mie Liste
        </button>
        )}
        {/* Pulsante per la registrazione, se l'utente è arrivato qui da un contesto diverso (es. logout) */}
        {!token && (<button className="btn btn-secondary btn-lg" onClick={() => navigate('/register')}>
          Registrati
        </button>
  )}
      </div>
    </div>
  );
}

export default HomePage;