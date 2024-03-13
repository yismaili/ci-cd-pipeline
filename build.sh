#!/usr/bin/env bash

DOCKER_USERNAME="yismaili"
DOCKER_PASSWORD="pass1227@"
DOCKER_REGISTRY="https://index.docker.io/v1/"

docker login --username "$DOCKER_USERNAME" --password "$DOCKER_PASSWORD" $DOCKER_REGISTRY

# Check if Docker registry is already running
if [ ! "$(docker ps -q -f name=registry)" ]; then
    # Start local Docker registry
    docker run -d -p 5000:5000 --restart=always --name registry registry:2
fi

cd frontend
echo "Building and pushing Docker image for frontend"
docker build -t localhost:5000/frontend:1.0 .
docker push localhost:5000/frontend:1.0

cd ..

cd backend
echo "Building and pushing Docker image for backend"
docker build -t localhost:5000/backend:1.0 .
docker push localhost:5000/backend:1.0

cd ..

echo "Deployment completed successfully!"

docker compose build 
docker compose up
