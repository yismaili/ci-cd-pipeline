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
                        def frontendTag = "${REGISTRY}/${APPNAME}:frontend-${GIT_COMMIT_SHORT}-${BUILD_NUMBER}"
                        sh """
                        echo "Preparing Frontend"
                        docker build -t ${frontendTag} .
                        docker push ${frontendTag}
                        cd ..
                        echo "FRONTEND_IMAGE=${frontendTag}" >> .env
                        echo "Push to Registry - End"
                        """
                    }
                }
            }
        }

        stage('Preparing Backend') {
            steps {
                script {
                    dir('backend') {
                        def backendTag = "${REGISTRY}/${APPNAME}:backend-${GIT_COMMIT_SHORT}-${BUILD_NUMBER}"
                        sh """
                        echo "Preparing Backend"
                        docker build -t ${backendTag} .
                        docker push ${backendTag}
                        cd ..
                        echo "BACKEND_IMAGE=${backendTag}" >> .env
                        echo "Push to Registry - End"
                        """
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

        // stage('Remove Unused Docker Images') {
        //     steps {
        //         script {
        //             // Construct the image reference patterns
        //             def imageReferenceBackend = "${registry}/${APPNAME}:backend-${GIT_COMMIT_SHORT}-${BUILD_NUMBER}"
        //             def imageReferenceFrontend = "${registry}/${APPNAME}:frontend-${GIT_COMMIT_SHORT}-${BUILD_NUMBER}"

        //             // Get the image IDs of images matching the specified reference patterns
        //             def matchedImageIdsBackend = sh(script: "docker images --filter=reference='${imageReferenceBackend}' -q", returnStdout: true).trim()
        //             def matchedImageIdsFrontend = sh(script: "docker images --filter=reference='${imageReferenceFrontend}' -q", returnStdout: true).trim()

        //             // Remove the matched images
        //             if (matchedImageIdsBackend) {
        //                 sh "docker rmi -f ${matchedImageIdsBackend}"
        //             } else {
        //                 echo "No backend images matching the specified pattern found."
        //             }

        //             if (matchedImageIdsFrontend) {
        //                 sh "docker rmi -f ${matchedImageIdsFrontend}"
        //             } else {
        //                 echo "No frontend images matching the specified pattern found."
        //             }
        //         }
        //     }
        // }

       stage('Remove Unused Docker Images') {
    steps {
        script {
            // Construct the image reference patterns
            def imageReferenceBackend = "${registry}/${APPNAME}:backend-${GIT_COMMIT_SHORT}-${BUILD_NUMBER}"
            def imageReferenceFrontend = "${registry}/${APPNAME}:frontend-${GIT_COMMIT_SHORT}-${BUILD_NUMBER}"

            // Get the image IDs of images matching the specified reference patterns
            def matchedImageIdsBackend = sh(script: "docker images --filter=reference='${imageReferenceBackend}' -q", returnStdout: true).trim().split()
            def matchedImageIdsFrontend = sh(script: "docker images --filter=reference='${imageReferenceFrontend}' -q", returnStdout: true).trim().split()

            // Get the IDs of all images
            def allImageIds = sh(script: "docker images -q", returnStdout: true).trim().split()

            // Get the IDs of the last 10 images
            def last10ImageIds = allImageIds.takeRight(10)

            // Remove the matched images except for the last 10
            if (matchedImageIdsBackend) {
                def imagesToRemoveBackend = matchedImageIdsBackend - last10ImageIds
                if (imagesToRemoveBackend) {
                    sh "docker rmi -f ${imagesToRemoveBackend.join(' ')}"
                } else {
                    echo "All backend images matching the specified pattern are among the last 10 images."
                }
            } else {
                echo "No backend images matching the specified pattern found."
            }

            if (matchedImageIdsFrontend) {
                def imagesToRemoveFrontend = matchedImageIdsFrontend - last10ImageIds
                if (imagesToRemoveFrontend) {
                    sh "docker rmi -f ${imagesToRemoveFrontend.join(' ')}"
                } else {
                    echo "All frontend images matching the specified pattern are among the last 10 images."
                }
            } else {
                echo "No frontend images matching the specified pattern found."
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
                    //sleep time: 200, unit: 'SECONDS'
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
