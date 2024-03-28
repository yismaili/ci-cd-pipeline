pipeline {
    agent any

    options {
        timeout(time: 1, unit: 'HOURS')
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '20', artifactNumToKeepStr: '10', daysToKeepStr: '30'))
    }

    environment {
        // DOCKER_USERNAME = "yismaili"
        // DOCKER_PASSWORD = "pass1227@"
        // DOCKER_REGISTRY = "https://index.docker.io/v1/"
        registry="localhost:5000/test"
        GIT_COMMIT_SHORT = sh(script: "git rev-parse --short ${GIT_COMMIT}", returnStdout: true).trim()
    }

    stages {
        stage('Setup') {
            steps {
                script {
                    env.CUSTOMNAME = env.GIT_BRANCH.split("/")[1]
                    env.APPNAME = sh(script: 'basename -s .git ${GIT_URL}', returnStdout: true).trim()
                    targetFolderArray = env.GIT_BRANCH.split("/")
                    targetFolder = targetFolderArray[targetFolderArray.size() - 1]
                    currentBuild.displayName = "${CUSTOMNAME}/${env.GIT_COMMIT_SHORT}-${env.BUILD_NUMBER}" 
                    sh '''
                        echo "${GIT_COMMIT_SHORT}-${BUILD_NUMBER}" > latest.txt
                        cat latest.txt
                        echo "${GIT_COMMIT_SHORT}-${BUILD_NUMBER}" > ${GIT_COMMIT_SHORT}.txt
                        echo "${GIT_COMMIT_SHORT}.txt"
                    '''            
                }
            }
        }

        stage('Docker Login') {
            steps {
                script {
                    // docker.withRegistry(DOCKER_REGISTRY, DOCKER_USERNAME, DOCKER_PASSWORD) {
                        // No need to do anything here, as docker.withRegistry handles the login
                        sh './build.sh'
                    // }
                }
            }
        }

        stage('Start Local Docker Registry') {
            steps {
                script {
                    def isRegistryRunning = sh(script: 'docker ps -q -f name=registry', returnStatus: true) == 0
                    if (!isRegistryRunning) {
                        // Start local Docker registry
                        sh 'docker run -d -p 5000:5000 --restart=always --name registry registry:2'
                    }
                }
            }
        }

        stage('Preparing Frontend') {
            steps {
                script {
                    dir('frontend') {
                        sh '''
                        echo "Preparing Frontend"
                        docker build -t ${registry}/${APPNAME}:${GIT_COMMIT_SHORT}-${BUILD_NUMBER} .
                        docker push ${registry}/${APPNAME}:${GIT_COMMIT_SHORT}-${BUILD_NUMBER}
                        echo "Push to Registry - End"
                        '''
                    }
                }
            }
        }

        stage('Preparing Backend') {
            steps {
                script {
                    dir('backend') {
                       sh '''
                        echo "Preparing Backend"
                        docker build -t ${registry}/${APPNAME}:${GIT_COMMIT_SHORT}-${BUILD_NUMBER} .
                        docker push ${registry}/${APPNAME}:${GIT_COMMIT_SHORT}-${BUILD_NUMBER}
                        cd ..
                        echo "BACKEND_IMAGE=${registry}/${APPNAME}:${GIT_COMMIT_SHORT}-${BUILD_NUMBER}" > .env
                        echo "Push to Registry - End"
                        '''
                    }
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


        // stage('Remove Unused docker image') {
        //     steps {
        //         sh '''
        //         echo "Remove Unused docker image - Begin"
        //         docker images
        //         echo "Remove Unused docker image - End"
        //         '''
        //     }
        // }

        // stage('Remove Unused docker image') {
        //     steps {
        //         script {
        //            // sh 'echo "docker images --filter=reference="*${APPNAME}:${GIT_COMMIT_SHORT}-${BUILD_NUMBER}*" -q"'
        //             try {
        //                 echo "Remove Unused docker image - Begin"
        //                 //sh 'docker images ${registry}/${APPNAME}'
        //                 sh 'docker images --filter=reference="*${registry}/${APPNAME}:${GIT_COMMIT_SHORT}-${BUILD_NUMBER}*" -q'
        //                 echo "Remove Unused docker image - End"
        //             } catch (Exception e) {
        //                 echo "Error occurred while removing unused Docker images: ${e}"
        //                 currentBuild.result = 'FAILURE'
        //             }
        //         }
        //     }
        // }

        stage('Remove Unused docker image') {
            steps {
                script {
                    try {
                        echo "Remove Unused docker image - Begin"
                        
                        // List Docker images matching the specified reference pattern
                        def referencePattern = "${registry}/${APPNAME}:${GIT_COMMIT_SHORT}-${BUILD_NUMBER}"
                        def imageIds = sh(script: "docker images --filter=reference='*${referencePattern}*' -q", returnStdout: true).trim()
                        
                        // If there are images matching the pattern, remove them
                        if (imageIds) {
                            sh "docker rmi -f ${imageIds}"
                            echo "Removed Docker images: ${imageIds}"
                        } else {
                            echo "No Docker images matching the reference pattern found."
                        }
                        
                        echo "Remove Unused docker image - End"
                    } catch (Exception e) {
                        echo "Error occurred while removing unused Docker images: ${e}"
                        currentBuild.result = 'FAILURE'
                    }
                }
            }
        }


        stage('Deployment') {
            steps {
                script {
                    // Deployment tasks
                    sh 'docker compose build'
                    sh 'docker compose up -d'
                    sleep time: 200, unit: 'SECONDS'
                    sh 'docker compose down'
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
