#!/bin/bash

# Simple test script to verify the Task Manager setup
echo "🧪 Task Manager - Quick Setup Test"
echo "=================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "1. Testing backend API..."

# Test if Rails server is running
if curl -s http://localhost:3000/api/v1/tasks >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Rails API is responding${NC}"
    
    # Test API endpoints
    echo "  - Testing GET /api/v1/tasks"
    RESPONSE=$(curl -s http://localhost:3000/api/v1/tasks)
    if [[ $RESPONSE == *"tasks"* ]]; then
        echo -e "${GREEN}  ✓ Tasks endpoint working${NC}"
    else
        echo -e "${RED}  ✗ Tasks endpoint not working${NC}"
    fi
    
    # Test search endpoint
    echo "  - Testing GET /api/v1/tasks/search"
    SEARCH_RESPONSE=$(curl -s "http://localhost:3000/api/v1/tasks/search?q=test")
    if [[ $SEARCH_RESPONSE == *"tasks"* ]]; then
        echo -e "${GREEN}  ✓ Search endpoint working${NC}"
    else
        echo -e "${RED}  ✗ Search endpoint not working${NC}"
    fi
    
else
    echo -e "${RED}✗ Rails API is not responding${NC}"
    echo "  Make sure to start the Rails server with: rails server -p 3000"
fi

echo ""
echo "2. Testing frontend build..."

cd frontend

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓ Node modules installed${NC}"
else
    echo -e "${RED}✗ Node modules not found${NC}"
    echo "  Run: npm install"
fi

# Check if build works
if npm run build >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Frontend builds successfully${NC}"
else
    echo -e "${RED}✗ Frontend build failed${NC}"
    echo "  Check for compilation errors"
fi

cd ..

echo ""
echo "3. Testing database..."

# Check if database exists and has data
TASK_COUNT=$(bundle exec rails runner "puts Task.count")
if [[ $TASK_COUNT =~ ^[0-9]+$ ]]; then
    echo -e "${GREEN}✓ Database is working (${TASK_COUNT} tasks found)${NC}"
else
    echo -e "${RED}✗ Database issue${NC}"
    echo "  Run: rails db:create db:migrate db:seed"
fi

echo ""
echo "4. Summary:"
echo "  - Rails API: http://localhost:3000/api/v1"
echo "  - React Frontend: http://localhost:3001"
echo "  - API Documentation: Check README.md"
echo ""
echo "To start development servers:"
echo "  ./start_dev.sh"
echo ""
echo "Or manually:"
echo "  rails server -p 3000"
echo "  cd frontend && npm start"
