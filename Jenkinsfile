pipeline {
    agent any

    stages {
        stage('checkout') {
            steps {
                checkout scm
            }
        }
        
         stage('Test') {
            steps {
                sh 'sudo apt install npm'
                // sh 'npm test' we have to make tests
            }
        }
        
         stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage("Build Image"){
            steps{
                sh 'docker build -t my-app:1.0 .'
            }
        }
         
        stages {
        stage('Example') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker_cred', usernameVariable: 'DOCKERHUB_USERNAME', passwordVariable: 'DOCKERHUB_PASSWORD')]) {
                    sh '''
                        docker login -u $DOCKERHUB_USERNAME -p $DOCKERHUB_PASSWORD
                        docker tag my-app:1.0 bashidkk/my-app:1.0
                        docker push ashidkk/my-app:1.0
                        docker logout 
                    '''
                }
            }
        }
    }
    
    post
    {
        always
        {
            emailext body: 'just for testing and ', subject: 'Test', to: 'yo.ismailii@gmail.com'
        }
    }
}
