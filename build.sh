#!/bin/bash

# Set Docker credentials as environment variables
DOCKER_USERNAME="yismaili"
DOCKER_PASSWORD="pass1227@"
DOCKER_REGISTRY="https://index.docker.io/v1/"

echo "$DOCKER_PASSWORD" | docker login --username "$DOCKER_USERNAME" --password-stdin $DOCKER_REGISTRY

if docker ps -a --format '{{.Names}}' | grep -q "^registry$"; then
    echo "Docker registry container 'registry' already exists."
else
    docker run -d -p 5000:5000 --restart=always --name registry registry:2
fi
