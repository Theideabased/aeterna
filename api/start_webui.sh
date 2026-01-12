#!/bin/bash
# Aeterna Web UI Startup Script (Streamlit)

echo "🌐 Starting Aeterna Web UI..."
echo ""

# Navigate to project directory
cd /home/user/Documents/aeterna/api

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

# Start the Web UI
echo "✨ Starting Web UI on http://127.0.0.1:8501"
echo ""
echo "Press Ctrl+C to stop the server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

sh webui.sh
