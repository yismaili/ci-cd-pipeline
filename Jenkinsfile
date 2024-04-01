pipeline {
    agent any

    options {
        timeout(time: 1, unit: 'HOURS')
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '20', artifactNumToKeepStr: '10', daysToKeepStr: '30'))
    }

    environment {
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
                    sh './build.sh'
                }
            }
        }

        stage('Start Local Docker Registry') {
            steps {
                script {
                    def isRegistryRunning = sh(script: 'docker ps -q -f name=registry', returnStatus: true) == 0
                    if (!isRegistryRunning) {
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

        stage('Remove Unused Docker Images') {
            steps {
                script {
                    def imageReferenceBackend = "${registry}/${APPNAME}:backend-${GIT_COMMIT_SHORT}-${BUILD_NUMBER}"
                    def imageReferenceFrontend = "${registry}/${APPNAME}:frontend-${GIT_COMMIT_SHORT}-${BUILD_NUMBER}"

                    def matchedImageIdsBackend = sh(script: "docker images --filter=reference='${imageReferenceBackend}' -q", returnStdout: true).trim().split()
                    def matchedImageIdsFrontend = sh(script: "docker images --filter=reference='${imageReferenceFrontend}' -q", returnStdout: true).trim().split()
                    def allImageIds = sh(script: "docker images -q", returnStdout: true).trim().split()

                    def creationDates = []

                    for (imageId in allImageIds) {
                        def creationDate = sh(script: "docker inspect --format='{{.Created}}' $imageId", returnStdout: true).trim()
                        creationDates.add([id: imageId, date: creationDate])
                    }

                    creationDates.sort { a, b -> b.date <=> a.date }

                    def last10ImageIds = creationDates.take(10).collect { it.id }

                    println "Last 10 image IDs:"
                    println last10ImageIds.join('\n')

                    removeUnusedImages(matchedImageIdsBackend, last10ImageIds, "backend")
                    removeUnusedImages(matchedImageIdsFrontend, last10ImageIds, "frontend")
                }
            }
        }

        stage('Deployment') {
            steps {
                script {
                    sh 'docker compose build'
                    sh 'docker compose up -d'
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

def removeUnusedImages(matchedImages, last10ImageIds, type) {
    if (matchedImages) {
        def imagesToRemove = matchedImages.findAll { !(last10ImageIds.contains(it)) }
        if (imagesToRemove) {
            sh "docker rmi -f ${imagesToRemove.join(' ')}"
            println "Removed ${type} images not among the last 10."
        } else {
            println "All ${type} images matching the specified pattern are among the last 10 images."
        }
    } else {
        println "No ${type} images matching the specified pattern found."
    }
}
