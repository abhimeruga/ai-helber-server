#!/bin/bash
set -euo pipefail

# Debug info
echo "=== Starting Build ==="
echo "Node: $(node -v)"
echo "NPM: $(npm -v)"
echo "PWD: $(pwd)"
ls -la

# Clean environment
rm -rf node_modules
rm -f package-lock.json

# Install production dependencies first
npm install --production --legacy-peer-deps --no-audit

# Then install dev dependencies separately
npm install --only=dev --legacy-peer-deps --no-audit

# Explicitly install types
npm run install-types

# Verify installations
echo "Installed @types packages:"
npm list @types/node @types/express @types/cors @types/body-parser

# Build project
npm run build

# Verify build
echo "Build contents:"
ls -l dist/
echo "=== Build Successful ==="