# 📋 Task Board Semplificata - Frontend (React.js)

## 📌 Descrizione del Progetto

**Task Board Semplificata** è una web app frontend sviluppata in **React.js**, progettata per la gestione di task personali organizzati in liste. L'app interagisce con un **API REST backend** (es. ASP.NET Core Web API) e offre un'interfaccia moderna, responsive e facilmente utilizzabile.

**Url del sito in costruzione** https://yellow-water-0e71ab51e.1.azurestaticapps.net/
---

## 🎯 Obiettivi dell'Applicazione

- ✅ Creazione, modifica ed eliminazione di **liste di task**
- ✅ Gestione dei **task** (CRUD + cambio stato)
- ✅ Visualizzazione dettagliata di ogni task: titolo, descrizione, scadenza, stato
- ✅ Cambio stato: "Da fare", "In corso", "Completato"
- ✅ Esperienza **responsive** su desktop, tablet e mobile

---

## 🔐 Funzionalità Autenticazione

### Login

- Login tramite **Username o Email** e **Password**
- Gestione del **token JWT** per l'autenticazione persistente
- Redirezione automatica alle liste dopo il login
- Pulsante **"Registrati Ora"** nella schermata di login

### Registrazione

- Form con **nome, cognome, username, email, data di nascita, password e conferma password**
- Verifica della password prima dell’invio

---

## 📂 Gestione Liste (`/lists`)

- **Visualizzazione**: Mostra tutte le liste dell'utente autenticato
- **Creazione**: Aggiunta di nuove liste
- **Modifica**: Rinomina delle liste
- **Eliminazione**: Rimozione di liste (con conferma) → rimuove anche i task associati

---

## ✅ Gestione Task (`/tasks`)

- **Visualizzazione**: Mostra i task della lista selezionata
- **Creazione**: Inserimento di nuovi task con dettagli completi
- **Modifica**: Aggiornamento dei dati del task
- **Eliminazione**: Cancellazione task (con conferma)
- **Cambio Stato**: Da fare ⇉ In corso ⇉ Completato

---

## 🔔 Notifiche Utente

- Notifiche **toast** in basso a destra per:
  - Successi (es. "Lista creata con successo")
  - Errori (es. "Errore di rete")
  - Informazioni generali

---

## 🛠️ Architettura & Tecnologie

### Framework & Librerie

- **React.js** – UI dinamica e component-based
- **Bootstrap** – Layout responsive
- **React Context API** – Stato globale

### Contesti Globali

- `AuthContext.jsx`: Gestione token JWT, login, logout, fetch autenticati
- `DataContext.jsx`: CRUD su liste e task con fetch protetti
- `UIContext.jsx`: Navigazione, notifiche, stato dell’interfaccia

### Stili

- Stile personalizzato simulando **SCSS modularizzato**
- Layout responsive con classi Bootstrap

---

## 🌐 Comunicazione API

Tutte le operazioni (login, registrazione, gestione task/liste) avvengono tramite chiamate al **backend API REST**.

> ⚠️ Assicurati che il backend sia avviato prima di usare il frontend.

---

## 📁 Struttura del Codice

```
in questa srtuttura manca 'assets' e 'style'. potresti aggiungere e farmi una struttura con i nomi dei file nelle cartelle
src/
│   App.css
│   App.jsx
│   index.css
│   main.jsx
│
├── api/
│   └── apiService.js
│
├── assets/
│   └── react.svg
│
├── components/
│   ├── modals/
│   │   ├── ConfirmModal.jsx
│   │   ├── ListModal.jsx
│   │   └── TaskModal.jsx
│   │
│   └── ui/
│       ├── Header.jsx
│       └── Notification.jsx
│
├── contexts/
│   ├── AuthContext.jsx
│   ├── DataContext.jsx
│   └── UIContext.jsx
│
├── pages/
│   ├── HomePage.jsx
│   ├── Lists.jsx
│   ├── Login.jsx
│   ├── RegistrationForm.jsx
│   └── Tasks.jsx
│
├── styles/
│   ├── components.scss
│   ├── main.scss
│   ├── _base.scss
│   ├── _mixins.scss
│   └── _variables.scss
│
└── utils/
    └── helpers.jsx
```

---

## 🚀 Avvio del Progetto

### 1. Clona il repository

```bash
git clone https://github.com/WilliamNG01/DEV4Side-FRONTEndToDoTasks-.git
cd DEV4Side-FRONTEndToDoTasks-
```

### 2. Installa le dipendenze

```bash
npm install
# oppure
yarn install
```

### 3. Configura l'URL del backend

Apri `src/api/apiService.js` e modifica la costante `API_BASE_URL`:

```js
const API_BASE_URL = 'http://localhost:5000/api'; // ← Modifica questo URL
```

> Usa l’URL del backend reale se è deployato (es. Azure)

### 4. Avvia il progetto

```bash
npm run dev
# oppure
yarn dev
```

L'app si aprirà automaticamente su: `http://localhost:5173/`

---

## 🧬 Utilizzo dell’Applicazione

1. **Login / Registrazione**: All’avvio, effettua il login o registrati
2. **Gestione Liste**: Crea, modifica o elimina le tue liste
3. **Gestione Task**: Visualizza e gestisci i task dentro ogni lista
4. **Logout**: Usa il pulsante nella barra di navigazione

---

## 📦 Requisiti

- Node.js ≥ v18
- Backend API REST funzionante (es. ASP.NET Core Web API)
- Connessione Internet per caricare le dipendenze

---

## 💡 Conclusione

Questa app fornisce una base solida per un sistema di gestione task personale, dimostrando:

- Uso avanzato di React con Context API
- Comunicazione sicura con API REST
- Design responsive e UX curata

> 📨 Per domande o contributi, apri una issue o un pull request nel repository!

