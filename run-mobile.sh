#!/bin/bash

# Add Homebrew to PATH
export PATH="/opt/homebrew/bin:$PATH"

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Navigate to mobile directory
cd /Users/xavi.zanatta/Documents/DrPlantes/mobile

echo "Starting Expo with watchman..."
echo "Node version: $(node --version)"
echo "Watchman version: $(watchman version 2>/dev/null || echo 'not found')"
echo ""

# Start expo
npx expo start
