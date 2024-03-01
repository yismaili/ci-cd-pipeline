pipeline {
    agent any

    stages {
        stage('Install Docker Compose') {
            steps {
                sh 'curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose'
                sh 'chmod +x /usr/local/bin/docker-compose'
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker-compose build"
                }
            }
        }
        stage('Push Docker Image') {
            steps {
                script {
                    sh "docker-compose push"
                }
            }
        }
    }
}

