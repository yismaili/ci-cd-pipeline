#!/bin/bash

# Set Docker credentials as environment variables
export DOCKER_USERNAME="yismaili"
export DOCKER_PASSWORD="pass1227@"
export DOCKER_REGISTRY="https://index.docker.io/v1/"

# Log in to Docker registry
docker login --username "$DOCKER_USERNAME" --password "$DOCKER_PASSWORD" $DOCKER_REGISTRY

# Check if the Docker registry container already exists
if docker ps -a --format '{{.Names}}' | grep -q "^registry$"; then
    echo "Docker registry container 'registry' already exists."
else
    # docker rm registry
    docker run -d -p 5000:5000 --restart=always --name registry registry:2
fi
