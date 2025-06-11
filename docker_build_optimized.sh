#!/bin/bash

# Script di build ottimizzato per Docker
echo "🚀 Build ottimizzato Docker..."

# Abilita BuildKit per prestazioni migliori
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Funzione per build parallelo
build_parallel() {
    echo "📦 Building containers in parallelo..."
    
    # Build backend e frontend in parallelo
    docker-compose build --parallel --no-cache backend frontend &
    
    # Pull database image
    docker-compose pull db &
    
    # Aspetta che tutti i build finiscano
    wait
    
    echo "✅ Build completato!"
}

# Funzione per build con cache
build_with_cache() {
    echo "📦 Building con cache ottimizzata..."
    
    # Pre-pull base images
    docker pull ruby:3.4.1-slim &
    docker pull node:18-alpine &
    docker pull postgres:14-alpine &
    wait
    
    # Build con cache
    docker-compose build --parallel
    
    echo "✅ Build con cache completato!"
}

# Funzione per cleanup
cleanup() {
    echo "🧹 Cleanup cache Docker..."
    docker system prune -f
    docker builder prune -f
}

# Menu principale
case "${1:-cache}" in
    "fresh")
        echo "🔄 Build completo senza cache..."
        cleanup
        build_parallel
        ;;
    "cache")
        echo "⚡ Build veloce con cache..."
        build_with_cache
        ;;
    "cleanup")
        cleanup
        ;;
    *)
        echo "Uso: $0 [fresh|cache|cleanup]"
        echo "  fresh   - Build completo senza cache"
        echo "  cache   - Build veloce con cache (default)"
        echo "  cleanup - Pulisce cache Docker"
        exit 1
        ;;
esac

echo "🎉 Processo completato!"
