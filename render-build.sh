#!/bin/bash
set -euo pipefail

# Debugging info
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Current directory: $(pwd)"
ls -la

# Clean environment
npm cache clean --force
rm -rf node_modules/ dist/
rm -f package-lock.json

# Install all dependencies
npm install --production=false --legacy-peer-deps --no-audit

# Verify types are installed
echo "Checking installed @types packages:"
npm list @types/node @types/express @types/cors @types/body-parser @types/http-errors

# Build TypeScript
npm run build

# Verify output
echo "Build output:"
ls -l dist/