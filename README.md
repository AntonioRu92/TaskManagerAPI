# Task Manager

Applicazione web per la gestione di task con API Rails e frontend React.

## 🚀 Quick Start

### 1. Clone del progetto
```bash
git clone <repository-url>
cd Task_Manager_API
```

## 🐳 Avvio con Docker (Consigliato)

### Prerequisiti
- Docker Desktop installato e avviato

### Comandi
```bash
# Avvia tutti i servizi
docker-compose up -d

# Ferma tutti i servizi
docker-compose down

# Visualizza logs
docker-compose logs [service-name]

# Ricostruisci e riavvia
docker-compose down && docker-compose up --build -d
```

### Accesso applicazione
- **Frontend**: http://localhost:3002
- **Backend API**: http://localhost:3001/api/v1/tasks
- **Database**: PostgreSQL su localhost:5432

## 💻 Avvio in locale

### Prerequisiti
- Ruby 3.4.1
- Node.js 18+
- PostgreSQL 14
- Git

### Setup Backend
```bash
cd backend

# Installa dipendenze
bundle install

# Avvia PostgreSQL (macOS)
brew services start postgresql@14

# Setup database
rails db:create db:migrate db:seed

# Avvia server backend
rails server -p 3001
```

### Setup Frontend
```bash
cd frontend

# Installa dipendenze
npm install

# Avvia server frontend
PORT=3002 npm start
```

### Accesso applicazione
- **Frontend**: http://localhost:3002
- **Backend**: http://localhost:3001

## 🧪 Test

```bash
cd backend
bundle exec rspec
```

## 📋 Funzionalità

- ✅ Visualizzazione task con paginazione (10 per pagina)
- ✅ Creazione nuovi task
- ✅ Modifica task esistenti  
- ✅ Eliminazione task
- ✅ Cambio stato completamento task

## 🛠 API Endpoints

- `GET /api/v1/tasks` - Lista task (paginati)
- `POST /api/v1/tasks` - Crea nuovo task
- `GET /api/v1/tasks/:id` - Dettagli task
- `PUT/PATCH /api/v1/tasks/:id` - Aggiorna task
- `DELETE /api/v1/tasks/:id` - Elimina task

## 📊 Servizi Docker

- **backend**: Server Rails API (porta 3001)
- **frontend**: Server React development (porta 3002)  
- **db**: Database PostgreSQL 14 (porta 5432)

## 🔧 Comandi utili Docker

```bash
# Accedi al database
docker-compose exec db psql -U postgres -d task_manager_development

# Accedi al container backend
docker-compose exec backend bash

# Accedi al container frontend  
docker-compose exec frontend bash

# Visualizza status containers
docker-compose ps
```

## 💡 Note sviluppo

- L'applicazione include dati di esempio (12 task: 5 completati, 7 in sospeso)
- Hot reloading abilitato per entrambi frontend e backend
- CORS configurato per comunicazione cross-origin
- Database persistente tramite Docker volumes

## 🏗 Stack tecnologico

- **Backend**: Ruby on Rails 8.0.2, PostgreSQL 14
- **Frontend**: React 18, TypeScript, Tailwind CSS, Redux Toolkit
- **Deployment**: Docker, Docker Compose