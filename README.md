# Task Manager

Semplice applicazione per gestire task con Rails API e React frontend.

## 🛠 Setup

### 1. Clona il repository
```bash
git clone <repository-url>
cd Task_Manager_API
```

### 2. Avvio rapido
```bash
./start_dev.sh
```

Questo avvia automaticamente:
- Backend Rails su `http://localhost:3001`
- Frontend React su `http://localhost:3002`

### 3. Setup manuale (alternativo)

**Backend:**
```bash
cd backend
bundle install
brew services start postgresql@14
rails db:create db:migrate db:seed
rails server -p 3001
```

**Frontend:**
```bash
cd frontend
npm install
PORT=3002 npm start
```

## 🧪 Test
```bash
cd backend
bundle exec rspec
```

## 📋 Funzionalità

- Visualizza task con paginazione
- Crea nuovi task
- Modifica task esistenti
- Elimina task
- Segna task come completati

---

**Sviluppato con Ruby on Rails + React**
