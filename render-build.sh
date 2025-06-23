#!/bin/bash
set -euo pipefail
echo "=== Starting Build ==="

# Cleanup and install
npm cache clean --force
echo "NPM cache cleaned"

npm install --no-audit --prefer-offline
echo "Dependencies installed"

# Add any build steps here if needed
# npm run build

echo "=== Build Successful ==="