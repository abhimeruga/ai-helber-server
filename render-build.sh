#!/bin/bash
set -euo pipefail

# Clean environment
npm cache clean --force
rm -rf node_modules/ dist/

# Install all dependencies
npm install --production=false

# Verify types are installed
echo "Checking installed @types packages:"
npm list @types/node @types/express @types/cors @types/body-parser @types/http-errors

# Build TypeScript
npm run build

# Verify output
echo "Build output:"
ls -l dist/