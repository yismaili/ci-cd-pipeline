pipeline {
    agent any

    stages {
        stage('Prepare') {
            steps {
                script {
                    echo "Preparing environment"
                    sh 'mkdir -p db'
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    sh 'docker compose build'
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    sh 'echo "for testing application"'
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    sh 'docker compose up -d'
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
