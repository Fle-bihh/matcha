#!/bin/bash
# This script verify the presence of .env and apps/web/.env files. If not found, it copies the corresponding .env.example files to create them.

# Check if .env file exists in the root directory
if [ ! -f .env ]; then
    echo ".env file not found in the root directory. Creating from .env.example..."
    cp .env.example .env
    echo ".env file created."
else
    echo ".env file already exists in the root directory."
fi  

# Check if apps/web/.env file exists
if [ ! -f apps/web/.env ]; then
    echo "apps/web/.env file not found. Creating from apps/web/.env.example..."
    cp apps/web/.env.example apps/web/.env
    echo "apps/web/.env file created."
else
    echo "apps/web/.env file already exists."
fi  
echo "Environment setup complete."
# End of script