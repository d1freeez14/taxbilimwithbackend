#!/bin/bash

echo "🚀 Starting TaxBilim LMS Platform..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available. Please install Docker Desktop or Docker Compose first."
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "✅ Docker and Docker Compose are available"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Frontend Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
CLERK_SECRET_KEY=your_clerk_secret_here

# Backend Environment Variables
DATABASE_URL=postgresql://postgres:password@postgres:5432/taxbilim_db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
EOF
    echo "✅ Created .env file. Please update it with your actual values."
fi

# Create backend .env file if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend .env file..."
    cat > backend/.env << EOF
# Database
DATABASE_URL="postgresql://postgres:password@postgres:5432/taxbilim_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:3000"
EOF
    echo "✅ Created backend .env file."
fi

echo "🔧 Building and starting services..."
docker compose up --build -d

echo "⏳ Waiting for services to start..."
sleep 30

# Check if services are running
if docker compose ps | grep -q "Up"; then
    echo "✅ Services are running!"
    echo ""
    echo "🌐 Access your application:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:5001"
    echo "   Health Check: http://localhost:5001/health"
    echo ""
    echo "🔐 Default users (after seeding):"
    echo "   Admin: admin@taxbilim.com / admin123"
    echo "   Teacher: teacher@taxbilim.com / teacher123"
    echo "   Student: student@taxbilim.com / student123"
    echo ""
    echo "📊 View logs: docker compose logs -f"
    echo "🛑 Stop services: docker compose down"
else
    echo "❌ Some services failed to start. Check logs with: docker compose logs"
    exit 1
fi 