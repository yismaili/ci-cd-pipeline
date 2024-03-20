pipeline {
    agent any

    environment {
        FOO = "bar"
    }

    stages {
        stage('Install frontend dependencies') {
            steps {
                script {
                    dir('frontend') {
                        //sh 'npm install'
                        sh 'echo ${env.FOO}'
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
                    sh 'echo "hi 3"'
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    sh './build.sh'
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
                    sh 'echo "hi 4"'
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
