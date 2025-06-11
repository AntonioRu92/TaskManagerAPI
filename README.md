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

### Setup Automatico
```bash
# Dopo aver clonato il repository, esegui:
./setup.sh
```

Lo script farà automaticamente:
- ✅ Verifica prerequisiti (Docker, Docker Compose)
- 📦 Build delle immagini Docker
- 🚀 Avvio di tutti i servizi
- 🔍 Test che tutto funzioni correttamente
- 📋 Mostra URLs e comandi utili

### Comandi Manuali (opzionali)
```bash
# Build e avvio
docker-compose up -d

# Ferma tutto
docker-compose down

# Visualizza logs
docker-compose logs [service-name]

# Ricostruisci immagini (solo se cambi dipendenze)
docker-compose build

# Status servizi
docker-compose ps
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

## 🚀 Quick Start per Nuovi Sviluppatori

**Dopo aver clonato il repository, è sufficiente un comando:**

```bash
# 1. Assicurati che Docker Desktop sia in esecuzione
# 2. Esegui il setup automatico
./setup.sh
```

Lo script farà automaticamente:
- ✅ Verifica che Docker sia installato e funzionante  
- 📦 Build delle immagini Docker (backend Rails + frontend React)
- 🚀 Avvio di tutti i servizi (database, backend, frontend)
- 🔍 Test di salute per verificare che tutto funzioni
- 🎉 Conferma che l'applicazione è pronta

**Tempo totale: ~3-5 minuti al primo setup**

### 📱 Applicazione Pronta
Dopo il setup, l'applicazione sarà disponibile su:
- **Frontend**: http://localhost:3002
- **Backend API**: http://localhost:3001/api/v1/tasks
- **Database**: PostgreSQL su localhost:5432

### 🛠 Comandi Utili per Sviluppo
```bash
# Ferma tutto
docker-compose down

# Visualizza logs
docker-compose logs [backend|frontend|db]

# Riavvia un servizio
docker-compose restart [backend|frontend|db]

# Status servizi
docker-compose ps
```

### 🔧 Risoluzione Problemi

**Se il setup si blocca o da errori:**
```bash
# Reset completo
docker-compose down
docker system prune -f
./setup.sh
```

**Se ci sono problemi persistenti:**
```bash
# Build completo senza cache
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

**Verificare che tutto funzioni:**
```bash
# Controlla status
docker-compose ps

# Controlla logs
docker-compose logs frontend
docker-compose logs backend

# Test rapido API
curl http://localhost:3001/api/v1/tasks
```

# Test rapido API
curl http://localhost:3001/api/v1/tasks
```

**È tutto qui!** Lo script `setup.sh` gestisce tutto automaticamente. 🚀

### 🚀 Ottimizzazioni Docker
- **BuildKit cache mounts**: Riduce i tempi di rebuild delle dipendenze
- **Multi-layer caching**: Separa dipendenze dal codice applicativo
- **Parallel builds**: Build simultaneo di backend e frontend
- **Volume caching**: Cache persistente per node_modules e bundle
- **Alpine images**: Immagini più leggere per il frontend
- **Health checks**: Avvio coordinato dei servizi

## 🏗 Stack tecnologico

- **Backend**: Ruby on Rails 8.0.2, PostgreSQL 14
- **Frontend**: React 18, TypeScript, Tailwind CSS, Redux Toolkit
- **Deployment**: Docker, Docker Compose