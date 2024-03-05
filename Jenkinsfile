pipeline {
    agent any

    stages {
        stage('Install frontend dependencies') {
            steps {
                script {
                    dir('frontend') {
                        sh 'npm install'
                    }
                }
            }
        }

        stage('Install backend dependencies') {
            steps {
                script {
                    dir('backend') {
                        sh 'npm install'
                    }
                }
            }
        }

        stage('Prepare database') {
            steps {
                script {
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
