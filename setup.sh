#!/bin/bash

echo "🎉 Bar Mitzvah RSVP Setup Script"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first:"
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm found: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "🎨 Setup Instructions:"
echo "====================="
echo ""
echo "1. Edit 'index.html' and update these placeholders:"
echo "   - [Your Son's Name] → Your son's actual name"
echo "   - [Date] → Event date (e.g., Saturday, March 15, 2025)"
echo "   - [Time] → Event time (e.g., 10:00 AM - 3:00 PM)"
echo "   - [Venue Name and Address] → Your venue details"
echo ""
echo "2. Start the server:"
echo "   npm start"
echo ""
echo "3. Open your browser:"
echo "   RSVP Form: http://localhost:3000"
echo "   Admin Dashboard: http://localhost:3000/admin"
echo ""
echo "4. For WhatsApp sharing, replace the message in index.html:"
echo "   Search for '[Your Son's Name]' in the WhatsApp section"
echo ""
echo "🚀 Ready to collect RSVPs!"
echo ""
echo "Need help? Check README.md for detailed instructions."
echo ""

