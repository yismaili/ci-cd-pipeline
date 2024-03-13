pipeline {
    agent any

    stages {
        stage('Install frontend dependencies') {
            steps {
                script {
                    dir('frontend') {
                        //sh 'npm install'
                        sh 'echo "hi 1"'
                    }
                }
            }
        }

        stage('Install backend dependencies') {
            steps {
                script {
                    dir('backend') {
                        //sh 'npm install'
                        sh 'echo "hi 2"'
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
                    sh './build.sh'
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
