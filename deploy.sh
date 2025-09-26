#!/bin/bash

# Reviews Dashboard Deployment Script
# Usage: ./deploy.sh [environment]
# Environment: development (default) | production

set -e

ENVIRONMENT=${1:-development}

echo "🚀 Deploying Reviews Dashboard in $ENVIRONMENT mode..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check environment file
if [ "$ENVIRONMENT" = "production" ]; then
    if [ ! -f ".env.production" ]; then
        echo "❌ .env.production file not found. Please create it from env.production.example"
        exit 1
    fi
    ENV_FILE=".env.production"
else
    if [ ! -f ".env" ]; then
        echo "❌ .env file not found. Please create it first."
        exit 1
    fi
    ENV_FILE=".env"
fi

echo "📋 Using environment file: $ENV_FILE"

# Build and start services
echo "🔨 Building Docker images..."
docker-compose --env-file "$ENV_FILE" build

echo "🚢 Starting services..."
docker-compose --env-file "$ENV_FILE" up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run database migrations
echo "🗄️ Running database migrations..."
docker-compose --env-file "$ENV_FILE" exec app npx prisma db push

echo "✅ Deployment complete!"
echo ""
echo "🌐 Application is available at: http://localhost:3000"
echo "📊 Manager Dashboard: http://localhost:3000/dashboard"
echo ""
echo "📝 Useful commands:"
echo "  View logs: docker-compose logs -f app"
echo "  Stop services: docker-compose down"
echo "  Restart: docker-compose restart"
echo "  Database console: docker-compose exec db psql -U reviews_user -d reviews_db"
echo ""
