#!/bin/bash
# Quick setup script for the Flask backend

echo "🚀 Setting up Flask Backend..."
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "✅ Activating virtual environment..."
source venv/bin/activate || source venv/Scripts/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your database credentials"
fi

echo ""
echo "✅ Backend setup complete!"
echo ""
echo "Next steps:"
echo "1. Ensure PostgreSQL is running"
echo "2. Ensure Redis is running"
echo "3. Create database: createdb blogsite_db"
echo "4. Run: flask db init"
echo "5. Run: flask db migrate -m 'Initial migration'"
echo "6. Run: flask db upgrade"
echo "7. Run: python seed.py (optional)"
echo "8. Run: python app.py"
echo ""
