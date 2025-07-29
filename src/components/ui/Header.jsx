import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
//import { UIContext } from '../../contexts/UIContext'; Rimosso UIContext perché setCurrentPage non è più usato per la navigazione principale
// Importa useNavigate se hai bisogno di navigazione programmatica (es. dopo logout)


const Header = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/home">
          <i className="bi bi-check2-square me-2"></i>
          App Liste & Compiti
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {token && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/home">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/lists">
                    Le Mie Liste
                  </Link>
                </li>
              </>
            )}
            {!token && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/home">
                    Home
                  </Link>
                </li>
              </>
            )}
          </ul>
          <div className="d-flex">
            {token ? (
              <button className="btn btn-danger" onClick={logout}>
                <i className="bi bi-box-arrow-right me-2"></i>
                Logout
              </button>
            ) : (
              <>
                <button className="btn btn-outline-light me-2" onClick={() => navigate('/login')}>
                  Login
                </button>
                <button className="btn btn-success" onClick={() => navigate('/register')}>
                  Registrati
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;