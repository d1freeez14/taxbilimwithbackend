#!/bin/sh

echo "🚀 Starting TaxBilim Backend..."

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "✅ PostgreSQL is ready!"

# Start the server (database initialization happens in the server)
echo "🚀 Starting server..."
npm start 