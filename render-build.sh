#!/bin/bash
set -euo pipefail

# Clean and install
npm cache clean --force
rm -rf node_modules/
npm install

# Install types if any are missing (safety check)
npm install --save-dev @types/node @types/express @types/cors @types/uuid || true

# Build TypeScript
npm run build

# Verify build
echo "Build contents:"
ls -l dist/