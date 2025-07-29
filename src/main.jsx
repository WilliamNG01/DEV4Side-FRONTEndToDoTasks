import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/main.scss';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* <-- App deve essere AVVOLTO da BrowserRouter QUI */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);