#!/bin/bash
# Render build script
set -e

echo "Installing dependencies..."
npm install

echo "Generating Prisma Client..."
npx prisma generate

echo "Compiling TypeScript..."
npx tsc --version
npx tsc

echo "Running database migrations..."
npx prisma migrate deploy

echo "Checking dist folder..."
ls -la
ls -la dist/ || echo "dist folder not found!"

echo "Build complete!"
