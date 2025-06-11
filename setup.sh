#!/bin/bash

# Task Manager - Setup Rapido Docker
# Script per avviare l'applicazione dopo aver clonato il repository

echo "🚀 Task Manager - Setup Docker"
echo "================================"

# Verifica prerequisiti
if ! command -v docker &> /dev/null; then
    echo "❌ Docker non trovato. Installa Docker Desktop prima di continuare."
    echo "   Scarica da: https://www.docker.com/products/docker-desktop/"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo "❌ Docker non è in esecuzione. Avvia Docker Desktop e riprova."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose non trovato. Installa Docker Compose."
    exit 1
fi

echo "✅ Prerequisiti verificati"

# Funzione di cleanup in caso di interruzione
cleanup() {
    echo ""
    echo "⚠️  Setup interrotto. Pulizia in corso..."
    docker-compose down
    exit 1
}
trap cleanup INT

# Ferma eventuali container in esecuzione
echo "🛑 Fermando eventuali container esistenti..."
docker-compose down

# Build delle immagini
echo "📦 Building immagini Docker..."
echo "   Questo potrebbe richiedere alcuni minuti al primo avvio..."

if ! docker-compose build; then
    echo "❌ Errore durante il build. Verifica i Dockerfile."
    exit 1
fi

# Avvio dei servizi
echo "🚀 Avvio servizi..."
if ! docker-compose up -d; then
    echo "❌ Errore durante l'avvio dei servizi."
    exit 1
fi

# Attesa che i servizi siano pronti
echo "⏳ Attendo che i servizi siano pronti..."
sleep 5

# Verifica che i servizi siano in esecuzione
echo "🔍 Verifica servizi..."

# Controlla database
for i in {1..30}; do
    if docker-compose exec -T db pg_isready -U postgres &> /dev/null; then
        echo "✅ Database pronto"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Database non risponde dopo 30 secondi"
        docker-compose logs db
        exit 1
    fi
    sleep 1
done

# Controlla backend
for i in {1..60}; do
    if curl -s http://localhost:3001/api/v1/tasks &> /dev/null; then
        echo "✅ Backend API pronto"
        break
    fi
    if [ $i -eq 60 ]; then
        echo "❌ Backend non risponde dopo 60 secondi"
        echo "   Logs backend:"
        docker-compose logs backend
        exit 1
    fi
    sleep 1
done

# Controlla frontend
for i in {1..90}; do
    if curl -s http://localhost:3002 &> /dev/null; then
        echo "✅ Frontend pronto"
        break
    fi
    if [ $i -eq 90 ]; then
        echo "❌ Frontend non risponde dopo 90 secondi"
        echo "   Logs frontend:"
        docker-compose logs frontend
        exit 1
    fi
    sleep 1
done

# Successo!
echo ""
echo "🎉 Setup completato con successo!"
echo "================================"
echo ""
echo "📱 Applicazione disponibile su:"
echo "   • Frontend: http://localhost:3002"
echo "   • Backend API: http://localhost:3001/api/v1/tasks"
echo "   • Database: PostgreSQL su localhost:5432"
echo ""
echo "📋 Comandi utili:"
echo "   • Visualizza logs: docker-compose logs [service-name]"
echo "   • Ferma tutto: docker-compose down"
echo "   • Riavvia: docker-compose restart"
echo "   • Status: docker-compose ps"
echo ""
echo "🔧 Per sviluppo:"
echo "   • I file sono sincronizzati automaticamente"
echo "   • Hot reloading abilitato per frontend e backend"
echo "   • Database persistente anche dopo restart"
echo ""
