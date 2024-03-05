pipeline {
    agent any

    stages {

        stage('Prepare') {
            steps {
                script {
                    sh 'echo "Preparing environment"'
                    sh 'mkdir -p db'
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    sh 'docker-compose build'
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    sh 'docker-compose up -d'
                }
            }
        }
    }
}
