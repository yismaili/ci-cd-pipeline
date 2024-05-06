#!/usr/bin/env bash
ssh-keygen -t ed25519 -f ~/.ssh/id_ansible -N ''
ssh-copy-id -i ~/.ssh/id_ansible yoyo@192.168.11.102

ansible-playbook -i inventory.yml deploy.yaml --ask-become-pass