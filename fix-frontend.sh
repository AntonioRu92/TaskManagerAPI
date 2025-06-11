#!/bin/bash

# Fix per dipendenze mancanti nel frontend
echo "🔧 Fix dipendenze frontend..."

# Controlla se i container sono in esecuzione
if ! docker-compose ps | grep -q "frontend.*Up"; then
    echo "❌ Container frontend non in esecuzione. Avvia prima con ./setup.sh"
    exit 1
fi

# Reinstalla le dipendenze nel container
echo "📦 Reinstallazione dipendenze nel container..."
docker-compose exec frontend npm install

# Riavvia il frontend
echo "🔄 Riavvio frontend..."
docker-compose restart frontend

# Aspetta che si riavvii
echo "⏳ Attendo riavvio..."
sleep 10

# Verifica che funzioni
echo "🔍 Verifica..."
for i in {1..30}; do
    if curl -s http://localhost:3002 &> /dev/null; then
        echo "✅ Frontend riparato e funzionante!"
        echo "📱 Apri: http://localhost:3002"
        exit 0
    fi
    sleep 2
done

echo "❌ Problema persiste. Logs:"
docker-compose logs --tail=20 frontend
