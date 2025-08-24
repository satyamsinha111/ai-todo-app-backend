#!/bin/bash

# AI-Powered Todo App Backend Startup Script

echo "🚀 Starting AI-Powered Todo App Backend..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cp env.example .env
    echo "📝 Please edit .env file with your configuration before running the app."
    echo "   Required variables:"
    echo "   - JWT_ACCESS_SECRET"
    echo "   - JWT_REFRESH_SECRET"
    echo "   - EMAIL_USER"
    echo "   - EMAIL_PASS"
    echo "   - EMAIL_FROM"
    echo ""
    echo "   Example for Gmail:"
    echo "   EMAIL_HOST=smtp.gmail.com"
    echo "   EMAIL_PORT=587"
    echo "   EMAIL_USER=your-email@gmail.com"
    echo "   EMAIL_PASS=your-app-password"
    echo "   EMAIL_FROM=your-email@gmail.com"
    echo ""
    exit 1
fi

# Check if MongoDB is running (optional check)
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found. Please install MongoDB or use MongoDB Atlas."
    echo "   For local development: https://docs.mongodb.com/manual/installation/"
    echo "   For MongoDB Atlas: https://www.mongodb.com/cloud/atlas"
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project
echo "🔨 Building TypeScript..."
npm run build

# Start the application
echo "🌟 Starting the server..."
echo "📚 API Documentation will be available at: http://localhost:3000/api-docs"
npm start
