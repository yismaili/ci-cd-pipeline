pipeline {
    agent any

  options {
    timeout(time: 1, unit: 'MINUTES')
    timestamps()
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '20', artifactNumToKeepStr: '10', daysToKeepStr: '30'))
  }
    environment {
        GIT_COMMIT_SHORT = sh(script: "git rev-parse --short ${GIT_COMMIT}", returnStdout: true).trim()
        //registry="docker-registry.leyton.com:5000/erc"
        AAA_SECRET_TEXT = credentials('secret-text')
    }

    stages {

    // stage('Setup') {
    //     steps {
    //       script {
    //         env.CUSTOMNAME  = env.GIT_BRANCH.split("/")[1]
    //         env.APPNAME = sh(script: 'basename -s .git ${GIT_URL}', returnStdout: true).trim()
    //         targetFolderArray = env.GIT_BRANCH.split("/")[1]
    //         targetFolder = targetFolderArray[targetFolderArray.size()-1]
    //         currentBuild.displayName = "${CUSTOMNAME}/${env.GIT_COMMIT_SHORT}-${env.BUILD_NUMBER}" 
    //         sh '''
    //         echo "${GIT_COMMIT_SHORT}-${BUILD_NUMBER}" > latest.txt
    //         cat latest.txt
    //         echo "${GIT_COMMIT_SHORT}-${BUILD_NUMBER}" > ${GIT_COMMIT_SHORT}.txt

    //         echo "${GIT_COMMIT_SHORT}.txt"
    //         '''            
    //       }
    //     }
    //   }

        stage('Install frontend dependencies') {
            steps {
                script {
                    dir('frontend') {
                        //sh 'npm install'
                        echo "hi 1 ${env.CUSTOMNAME}"
                        sh 'echo "git commit tag ${GIT_COMMIT_SHORT}"'
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
