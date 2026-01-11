#!/bin/bash
# Aeterna API Server Startup Script

echo "🚀 Starting Aeterna API Server..."
echo ""

# Navigate to project directory
cd /home/user/Documents/aeterna

# Activate virtual environment
echo "📦 Activating virtual environment..."
source .venv/bin/activate

# Check if config.toml exists
if [ ! -f "config.toml" ]; then
    echo "⚠️  config.toml not found. Creating from example..."
    cp config.example.toml config.toml
fi

# Export environment variables from .env if it exists
if [ -f ".env" ]; then
    echo "🔐 Loading environment variables from .env..."
    export $(grep -v '^#' .env | xargs)
fi

# Start the API server
echo "✨ Starting API server on http://127.0.0.1:8080"
echo "📖 API Documentation: http://127.0.0.1:8080/docs"
echo "📖 Alternative Docs: http://127.0.0.1:8080/redoc"
echo ""
echo "Press Ctrl+C to stop the server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

python main.py
