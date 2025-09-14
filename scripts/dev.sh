#!/bin/bash

# Development scripts for TaxBilim project

case "$1" in
  "restart")
    echo "🔄 Restarting all services..."
    docker compose restart
    ;;
  "restart-backend")
    echo "🔄 Restarting backend only..."
    docker compose restart backend
    ;;
  "restart-frontend")
    echo "🔄 Restarting frontend only..."
    docker compose restart frontend
    ;;
  "rebuild")
    echo "🔨 Rebuilding and restarting all services..."
    docker compose up --build
    ;;
  "rebuild-backend")
    echo "🔨 Rebuilding and restarting backend..."
    docker compose up --build backend
    ;;
  "logs")
    echo "📋 Showing logs..."
    docker compose logs -f
    ;;
  "logs-backend")
    echo "📋 Showing backend logs..."
    docker compose logs -f backend
    ;;
  "status")
    echo "📊 Container status:"
    docker compose ps
    ;;
  "clean")
    echo "🧹 Cleaning up (stopping and removing containers)..."
    docker compose down
    ;;
  "clean-all")
    echo "🧹 Cleaning up everything (containers, volumes, networks)..."
    docker compose down -v --remove-orphans
    ;;
  *)
    echo "Usage: $0 {restart|restart-backend|restart-frontend|rebuild|rebuild-backend|logs|logs-backend|status|clean|clean-all}"
    echo ""
    echo "Commands:"
    echo "  restart          - Restart all services"
    echo "  restart-backend  - Restart backend only"
    echo "  restart-frontend - Restart frontend only"
    echo "  rebuild          - Rebuild and restart all services"
    echo "  rebuild-backend  - Rebuild and restart backend only"
    echo "  logs             - Show all logs"
    echo "  logs-backend     - Show backend logs only"
    echo "  status           - Show container status"
    echo "  clean            - Stop and remove containers"
    echo "  clean-all        - Stop and remove everything"
    exit 1
    ;;
esac
