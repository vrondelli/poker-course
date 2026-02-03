#!/bin/bash

# Deployment Script for Poker Course

set -e

echo "🚀 Starting Deployment..."

# 1. Pull latest changes
echo "📥 Pulling latest code..."
git pull origin main

# 2. Rebuild and restart containers
echo "🔄 Rebuilding containers..."
docker-compose up -d --build

# 3. Prune unused images to save space
echo "🧹 Cleaning up..."
docker image prune -f

echo "✅ Deployment Complete! Frontend is live."
echo "   Frontend: http://localhost:80"
# echo "   Backend:  http://localhost:3001"
