#!/bin/bash

# Clone repository
git clone https://github.com/your-username/ime-ai-studio.git
cd ime-ai-studio

# Setup environment
cp .env.example .env
nano .env  # Edit environment variables

# Build and start containers
docker-compose build --no-cache
docker-compose up -d

# Check status
docker-compose ps