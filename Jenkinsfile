pipeline {
    agent any

    stages {
        stage('build') {
            steps {
                echo 'Build the appticaton'
            }
        }
        
         stage('test') {
            steps {
                echo 'Test the application'
            }
        }
        
         stage('Deploy') {
            steps {
                echo 'Deploy the application'
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
