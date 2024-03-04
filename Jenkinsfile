pipeline {
    agent any

    stages {

        stage('Hi') {
                steps {
                    script {
                        sh 'hi'
                    }
                }
        }

        stage('Verify Docker Compose') {
                steps {
                    script {
                        sh 'docker ps'
                    }
                }
        }
    }
}
