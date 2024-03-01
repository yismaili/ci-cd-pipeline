pipeline {
    agent any
 
    stages {
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
