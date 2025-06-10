#!/bin/bash

# Task Manager - Avvio Rapido
echo "🚀 Avvio Task Manager..."

# Setup Backend
echo "⚙️  Setup Backend..."
cd backend
bundle install --quiet
rails db:create db:migrate db:seed --quiet
rails server -p 3001 &

# Setup Frontend  
echo "⚙️  Setup Frontend..."
cd ../frontend
npm install --silent
PORT=3002 npm start &

echo "✅ Servers avviati:"
echo "   Frontend: http://localhost:3002"
echo "   Backend:  http://localhost:3001"

# Cleanup al termine
trap cleanup INT
wait