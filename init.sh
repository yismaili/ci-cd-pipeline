#!/bin/sh

sudo rm -rf /etc/docker/daemon.json

sudo touch /etc/docker/daemon.json

sudo bash -c 'echo "{
  \"hosts\": [\"tcp://192.168.100.40:2375\", \"unix:///var/run/docker.sock\"]
}" >> /etc/docker/daemon.json'

sudo systemctl restart docker

docker build -t myjenkins-blueocean:2.440.1-1 .

sudo chmod 666 /var/run/docker.sock

docker network create jenkins

docker rm jenkins-blueocean

docker run \
  --name jenkins-blueocean \
  --restart=on-failure \
  --detach \
  --network jenkins \
  --env DOCKER_HOST=tcp://192.168.100.40:2375 \
  --volume jenkins-data:/var/jenkins_home \
  --volume /var/run/docker.sock:/var/run/docker.sock \
  --publish 8081:8080 \
  --publish 50000:50000 \
  myjenkins-blueocean:2.440.1-1

