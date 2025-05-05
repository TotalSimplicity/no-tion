#!/bin/bash
set -e

# Load .env variables
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

if [ -z "$TARGET" ]; then
  echo "TARGET environment variable not set. Use 'prod' or 'dev'."
  exit 1
fi

if [ "$TARGET" = "prod" ]; then
  cat > docker-compose.yml << 'EOF'
version: '3'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      target: prod
    environment:
      - VITE_API_URL=${API_URL}
      - CHOKIDAR_USEPOLLING=true
      - WATCHPACK_POLLING=true
    ports:
      - 3000:3000
  
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
      target: prod
    ports:
      - 3001:3001
    environment:
      - MONGO_USER=${MONGO_USER}
      - MONGO_PASS=${MONGO_PASS}
      - MONGO_HOST=mongodb
      - MONGO_PORT=27017
      - MONGO_DB=${MONGO_DB}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongodb
  
  mongodb:
    image: mongo:7
    container_name: mongo
    ports:
      - 27017:27017
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_USER}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASS}
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
EOF

else
  cat > docker-compose.yml << 'EOF'
version: '3'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      target: dev
    environment:
      - VITE_API_URL=${API_URL}
      - CHOKIDAR_USEPOLLING=true
      - WATCHPACK_POLLING=true
    ports:
      - 5173:5173
    volumes:
      - ./frontend:/app
      - /app/node_modules

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
      target: dev
    ports:
      - 3001:3001
    volumes:
      - ./backend:/usr/src/app
      - /usr/src/app/node_modules
    environment:
      - MONGO_USER=${MONGO_USER}
      - MONGO_PASS=${MONGO_PASS}
      - MONGO_HOST=mongodb
      - MONGO_PORT=27017
      - MONGO_DB=${MONGO_DB}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongodb
  
  mongodb:
    image: mongo:7
    container_name: mongo
    ports:
      - 27017:27017
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_USER}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASS}
    volumes:
      - mongo_data:/data/db

  mongo-express:
    image: mongo-express
    container_name: mongo-express
    ports:
      - 8081:8081
    environment:
      - ME_CONFIG_MONGODB_ADMINUSERNAME=${MONGO_USER}
      - ME_CONFIG_MONGODB_ADMINPASSWORD=${MONGO_PASS}
      - ME_CONFIG_MONGODB_SERVER=mongodb
      - ME_CONFIG_BASICAUTH_USERNAME
      - ME_CONFIG_BASICAUTH_PASSWORD
    depends_on:
      - mongodb

volumes:
  mongo_data:
EOF
fi

docker compose up --build
