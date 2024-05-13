#!/usr/bin/env bash
ssh-keygen -t ed25519 -f ~/.ssh/id_ansible -N ''
ssh-copy-id -i ~/.ssh/id_ansible yoyo@192.168.100.76

ansible-playbook -i inventory.yml deploy.yaml --ask-become-pass



# docker run -d \
#   -v /var/run/docker.sock:/var/run/docker.sock \
#   -p 127.0.0.1:2375:2375 \
#   --name docker-proxy \
#   tecnativa/docker-socket-proxy
