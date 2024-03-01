pipeline {
    agent any

    stages {
        stage('Test') {
            steps {
                sh 'apt update && apt install -y npm' 
                // sh 'npm test' 
            }
        }

        stage('Build') {
            steps {
                sh 'npm install' 
                sh 'npm run build'
            }
        }

        stage('Build Image') {
            steps {
                sh 'docker build -t my-app:1.0 .'
            }
        }

        stage('Push Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker_cred', usernameVariable: 'DOCKERHUB_USERNAME', passwordVariable: 'DOCKERHUB_PASSWORD')]) {
                    sh '''
                        docker login -u $DOCKERHUB_USERNAME -p $DOCKERHUB_PASSWORD
                        docker tag my-app:1.0 bashidkk/my-app:1.0
                        docker push bashidkk/my-app:1.0
                        docker logout 
                    '''
                }
            }
        }
    }

    post {
        always {
            emailext body: 'The build has completed.', subject: 'Build Status', to: 'yo.ismailii@gmail.com'
        }
    }
}
