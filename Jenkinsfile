pipeline {
    agent any

    stages {

        stage('Hi') {
                steps {
                    script {
                        sh 'echo hi'
                    }
                }
        }

        stage('Verify Docker Compose') {
                steps {
                    script {
                        sh 'docker compose up'
                    }
                }
        }
    }
}
