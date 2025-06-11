#!/bin/bash

# Script per monitoraggio performance Docker
echo "📊 Monitoraggio Performance Docker..."

# Funzione per misurare tempi di build
benchmark_build() {
    echo "🔥 Benchmark Build Performance..."
    
    # Clean build (senza cache)
    echo "⏱️  Build senza cache..."
    docker-compose down -v 2>/dev/null
    docker system prune -f >/dev/null 2>&1
    
    start_time=$(date +%s)
    DOCKER_BUILDKIT=1 docker-compose build --no-cache --parallel >/dev/null 2>&1
    end_time=$(date +%s)
    clean_build_time=$((end_time - start_time))
    
    # Cached build
    echo "⚡ Build con cache..."
    start_time=$(date +%s)
    DOCKER_BUILDKIT=1 docker-compose build --parallel >/dev/null 2>&1
    end_time=$(date +%s)
    cached_build_time=$((end_time - start_time))
    
    # Risultati
    echo ""
    echo "📈 RISULTATI BENCHMARK:"
    echo "   Clean Build:  ${clean_build_time}s"
    echo "   Cached Build: ${cached_build_time}s"
    echo "   Miglioramento: $((clean_build_time - cached_build_time))s ($(( (clean_build_time - cached_build_time) * 100 / clean_build_time ))%)"
}

# Funzione per monitorare usage
monitor_usage() {
    echo "💾 Utilizzo Risorse Docker..."
    echo ""
    echo "🗄️  Spazio Disco:"
    docker system df
    echo ""
    echo "📦 Immagini:"
    docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}" | head -10
    echo ""
    echo "📋 Container Attivi:"
    docker-compose ps
}

# Funzione per cleanup intelligente
smart_cleanup() {
    echo "🧹 Cleanup Intelligente..."
    
    # Remove unused images but keep base images
    docker image prune -f
    
    # Remove unused build cache but keep recent
    docker builder prune -f --filter "until=168h"
    
    echo "✅ Cleanup completato!"
}

# Menu
case "${1:-monitor}" in
    "benchmark")
        benchmark_build
        ;;
    "monitor")
        monitor_usage
        ;;
    "cleanup")
        smart_cleanup
        ;;
    *)
        echo "Uso: $0 [benchmark|monitor|cleanup]"
        echo "  benchmark - Testa performance build"
        echo "  monitor   - Mostra utilizzo risorse (default)"
        echo "  cleanup   - Cleanup intelligente"
        exit 1
        ;;
esac
