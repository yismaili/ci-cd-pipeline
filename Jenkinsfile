pipeline {
    agent {
    label 'jenkins-slave01-worker01 || jenkins-slave01-worker02'
  }

  options {
    timeout(time: 1, unit: 'MINUTES')
    timestamps()
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '20', artifactNumToKeepStr: '10', daysToKeepStr: '30'))
  }
    environment {
        AAA_SECRET_TEXT = credentials('secret-text')
    }

    stages {
        stage('Install frontend dependencies') {
            steps {
                script {
                    dir('frontend') {
                        //sh 'npm install'
                        sh 'echo "hi 1 ${AAA_SECRET_TEXT}"'
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
