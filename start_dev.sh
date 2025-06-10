#!/bin/bash

# Task Manager - Development Startup Script
echo "🚀 Starting Task Manager Development Environment"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
port_in_use() {
    lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null
}

echo "📋 Checking prerequisites..."

# Check Ruby
if command_exists ruby; then
    echo -e "${GREEN}✓ Ruby found:${NC} $(ruby --version)"
else
    echo -e "${RED}✗ Ruby not found. Please install Ruby 3.2+${NC}"
    exit 1
fi

# Check Node.js
if command_exists node; then
    echo -e "${GREEN}✓ Node.js found:${NC} $(node --version)"
else
    echo -e "${RED}✗ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi

# Check PostgreSQL
if command_exists psql; then
    echo -e "${GREEN}✓ PostgreSQL found${NC}"
else
    echo -e "${YELLOW}⚠ PostgreSQL not found in PATH. Make sure it's installed and running${NC}"
fi

echo ""
echo "🔧 Setting up backend..."

cd backend

# Install backend dependencies
if [ ! -f Gemfile.lock ] || [ Gemfile -nt Gemfile.lock ]; then
    echo "Installing Ruby gems..."
    bundle install
fi

# Setup database
echo "Setting up database..."
bundle exec rails db:create 2>/dev/null || echo "Database already exists"
bundle exec rails db:migrate
bundle exec rails db:seed

cd ..

echo ""
echo "🎨 Setting up frontend..."

cd frontend

# Install frontend dependencies
if [ ! -d node_modules ] || [ package.json -nt package-lock.json ]; then
    echo "Installing npm packages..."
    npm install
fi

cd ..

echo ""
echo "🧪 Running tests..."

# Run backend tests
echo "Running backend tests..."
bundle exec rspec --format progress

echo ""
echo "🚀 Starting servers..."

# Check if ports are available
if port_in_use 3002; then
    echo -e "${YELLOW}⚠ Port 3002 is already in use. Please stop the existing service.${NC}"
    echo "You can find what's using the port with: lsof -i :3002"
    exit 1
fi

if port_in_use 3001; then
    echo -e "${YELLOW}⚠ Port 3001 is already in use. Please stop the existing service.${NC}"
    echo "You can find what's using the port with: lsof -i :3001"
    exit 1
fi

echo ""
echo -e "${BLUE}Starting Rails API server on port 3001...${NC}"
echo "API will be available at: http://localhost:3001/api/v1"

# Start Rails server in background
bundle exec rails server -p 3001 &
RAILS_PID=$!

# Wait a moment for Rails to start
sleep 3

echo ""
echo -e "${BLUE}Starting React development server on port 3002...${NC}"
echo "Frontend will be available at: http://localhost:3002"

# Start React server in background
cd frontend
npm start &
REACT_PID=$!

cd ..

echo ""
echo -e "${GREEN}🎉 Both servers are starting up!${NC}"
echo ""
echo "📱 Frontend: http://localhost:3002"
echo "🔧 Backend:  http://localhost:3001/api/v1"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $RAILS_PID 2>/dev/null
    kill $REACT_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT

# Wait for both processes
wait
