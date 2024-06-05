
pipeline {
    agent any
    options {
        timeout(time: 1, unit: 'HOURS')
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '20', artifactNumToKeepStr: '10', daysToKeepStr: '30'))
    }

        environment {
            registry = "localhost:5000"
            GIT_COMMIT_SHORT = sh(script: "git rev-parse --short ${GIT_COMMIT}", returnStdout: true).trim()
            STATUS = "CD"
            ITEMNAME = "test2"
            REPO_URL = "https://github.com/yismaili/ci-cd"
            BRANCH = "master"
            NEXUS_ARTEFACT_CREDENTIALS = 'nexus-credentials-id'
            NEXUS_ARTEFACT_URL = '192.168.100.75:8585'
            GIT_CREDENTIALS_ID = 'github-pat'
        }

        stages {
            
            stage('Checkout') {
                steps {
                    script {
                        checkout([
                            $class: 'GitSCM',
                            branches: [[name: env.BRANCH]],
                            userRemoteConfigs: [[
                                url: env.REPO_URL,
                                credentialsId: env.GIT_CREDENTIALS_ID
                            ]]
                        ])
                    }
                }
            }

            stage('Setup') {
                steps {
                    script {
                        env.CUSTOMNAME = env.GIT_BRANCH.split("/")[1]
                        env.APPNAME = sh(script: 'basename -s .git ${GIT_URL}', returnStdout: true).trim()
                        targetFolderArray = env.GIT_BRANCH.split("/")
                        targetFolder = targetFolderArray[targetFolderArray.size() - 1]
                        currentBuild.displayName = "${CUSTOMNAME}/${env.GIT_COMMIT_SHORT}-${env.BUILD_NUMBER}" 
                        sh '''
                            sudo cp /var/lib/jenkins/workspace/env/.env /var/lib/jenkins/workspace/env.ITEMNAME
                        '''
                        def isRegistryRunning = sh(
                            script: 'docker ps -q -f name=registry',
                            returnStdout: true
                        ).trim()
                        if (!isRegistryRunning) {
                            sh 'docker rm registry'
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

            stage('Tag and Push Backend Image to Nexus') {
                    steps {
                        script {
                            def backendTag = "${REGISTRY}/${env.APPNAME}:backend-${env.GIT_COMMIT_SHORT}-${env.BUILD_NUMBER}"
                            def nexusBackendTag = "${NEXUS_ARTEFACT_URL}/ci-cd:backend-${env.GIT_COMMIT_SHORT}-${env.BUILD_NUMBER}"

                            // Tag the backend image
                            //sh "docker tag ${backendTag} ${nexusBackendTag}"

                            // Log in to the Docker registry
                            withDockerRegistry([url: "http://${env.NEXUS_ARTEFACT_URL}", credentialsId: env.NEXUS_ARTEFACT_CREDENTIALS]) {
                                // Push the backend image
                                sh "docker push ${nexusBackendTag}"
                            }
                        }
                    }
                }

                stage('Tag and Push Frontend Image to Nexus') {
                    steps {
                        script {
                            def frontendTag = "${REGISTRY}/${env.APPNAME}:frontend-${env.GIT_COMMIT_SHORT}-${env.BUILD_NUMBER}"
                            def nexusFrontendTag = "${NEXUS_ARTEFACT_URL}/ci-cd:frontend-${env.GIT_COMMIT_SHORT}-${env.BUILD_NUMBER}"

                            // Tag the frontend image
                            sh "docker tag ${frontendTag} ${nexusFrontendTag}"

                            // Log in to the Docker registry
                            withDockerRegistry([url: "http://${env.NEXUS_ARTEFACT_URL}", credentialsId: env.NEXUS_ARTEFACT_CREDENTIALS]) {
                                // Push the frontend image
                                sh "docker push ${nexusFrontendTag}"
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

        stage('Build') {
            steps {
                script {
                    sh 'docker-compose build'
                    if (env.STATUS == 'CI') {
                        sh 'docker-compose down'
                        sh 'docker-compose up -d'
                    }
                }
            }
        }

        // stage('Send the frontend to the production environment') {
        //     environment {
        //         FRONTEND_TAG = "${REGISTRY}/${APPNAME}:frontend-${GIT_COMMIT_SHORT}-${BUILD_NUMBER}"
        //         REMOTE_SERVER = 'root@192.168.100.76'
        //         REMOTE_PATH = '/home/'
        //         FRONTENDIMAGE_TAG = "frontend-${GIT_COMMIT_SHORT}-${BUILD_NUMBER}"
        //     }
        //     when {
        //         expression { env.STATUS == 'CD' }
        //     }
        //     steps {
        //         dir('frontend') {
        //             script {
        //                 try {
        //                     sh """
        //                     echo "Saving Frontend Image"
        //                     sudo docker save -o ${FRONTENDIMAGE_TAG}.tar ${FRONTEND_TAG}
        //                     chown jenkins:jenkins ${FRONTENDIMAGE_TAG}.tar
        //                     chmod 644 ${FRONTENDIMAGE_TAG}.tar
        //                     ls -la 
        //                     echo "Transferring Frontend Image"
        //                     scp ${FRONTENDIMAGE_TAG}.tar ${REMOTE_SERVER}:${REMOTE_PATH}
        //                     """
        //                 } catch (Exception e) {
        //                     error "Failed to send frontend to production environment: ${e}"
        //                 }
        //             }
        //         }
        //     }
        // }

        // stage('Send the backend to the production environment') {
        //     environment {
        //         BACKEND_TAG = "${REGISTRY}/${APPNAME}:backend-${GIT_COMMIT_SHORT}-${BUILD_NUMBER}"
        //         REMOTE_SERVER = 'root@192.168.100.76'
        //         REMOTE_PATH = '/home/'
        //         BACKENDIMAGE_TAG = "backend-${GIT_COMMIT_SHORT}-${BUILD_NUMBER}"
        //         DATABASE_TAG = "postgres:latest"
        //         DATABASEIMAGE_TAG = "db-${GIT_COMMIT_SHORT}-${BUILD_NUMBER}"
        //     }
        //     when {
        //         expression { env.STATUS == 'CD' }
        //     }
        //     steps {
        //         dir('backend') {
        //             script {
        //                 try {
        //                     sh """
        //                     echo "Saving Backend Image"
        //                     sudo docker save -o ${BACKENDIMAGE_TAG}.tar ${BACKEND_TAG}
        //                     sudo docker save -o ${DATABASEIMAGE_TAG}.tar ${DATABASE_TAG}
        //                     sudo chown jenkins:jenkins ${BACKENDIMAGE_TAG}.tar
        //                     sudo chmod 644 ${BACKENDIMAGE_TAG}.tar
        //                     sudo chown jenkins:jenkins ${DATABASEIMAGE_TAG}.tar
        //                     sudo chmod 644 ${DATABASEIMAGE_TAG}.tar
        //                     echo "Transferring Backend Image"
        //                     scp ${BACKENDIMAGE_TAG}.tar ${REMOTE_SERVER}:${REMOTE_PATH}
        //                     echo "Transferring Database Image"
        //                     scp ${DATABASEIMAGE_TAG}.tar ${REMOTE_SERVER}:${REMOTE_PATH}
        //                     """
        //                 } catch (Exception e) {
        //                     error "Failed to send backend to production environment: ${e}"
        //                 }
        //             }
        //         }
        //     }
        // }

        stage('Remove Unused Docker Images') {
                steps {
                    script {
                        try {
                            
                            def backendTags = sh(script: "docker images --format '{{.Repository}}:{{.Tag}}' | grep '${registry}/${APPNAME}:backend-' || true", returnStdout: true).trim().split('\n').findAll { it }
                            def frontendTags = sh(script: "docker images --format '{{.Repository}}:{{.Tag}}' | grep '${registry}/${APPNAME}:frontend-' || true", returnStdout: true).trim().split('\n').findAll { it }
                            
                            removeOldImages(backendTags, 3, "backend")
                            removeOldImages(frontendTags, 3, "frontend")

                        } catch (Exception e) {
                            println "Error during image cleanup: ${e.message}"
                        }
                    }
                }
            }

        stage('Deployment') {
        steps {
            script {
                if (env.STATUS == 'CD') {
                    sh 'ansible-playbook -i inventory.yml deploy.yaml'
                }
            }
        }
    }

    }

    post {
        always {
            echo 'One way or another, I have finished'
            deleteDir()
        }
        success {
            echo 'I succeeded :)'
        }
        unstable {
            echo 'I am unstable :/'
        }
        failure {
            echo 'I failed :('
        }
    }
}

def removeOldImages(imageTags, lastN, type) {
    // println "Input imageTags: ${imageTags}"
    // println "Input lastN: ${lastN}"
    // println "Input type: ${type}"

    if (imageTags) {
        // split build numbers from image the tags
        def buildNumbers = imageTags.collect { tag ->
            def parts = tag.split(':')
            // println "Tag parts: ${parts}"
            def tagWithoutRepo = parts.length > 1 ? parts[2] : parts[0]
            // println "Tag without repo: ${tagWithoutRepo}"
            def buildNumberPart = tagWithoutRepo.tokenize('-').find { it.isNumber() }
            // println "Build number part: ${buildNumberPart}"
            def buildNumber = buildNumberPart?.toInteger()
            // println "Build number: ${buildNumber}"
            [tag: tag, buildNumber: buildNumber]
        }.findAll { it.buildNumber != null } // Remove entrie with null build number

       // println "Build numbers list: ${buildNumbers}"

        //  sort the build numbers by order
        def n = buildNumbers.size()
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (buildNumbers[j].buildNumber > buildNumbers[j + 1].buildNumber) {
                    def temp = buildNumbers[j]
                    buildNumbers[j] = buildNumbers[j + 1]
                    buildNumbers[j + 1] = temp
                }
            }
        }

        //println "Sorted build numbers: ${buildNumbers}"

        // Determine images to remove
        def imagesToRemove = buildNumbers.take(buildNumbers.size() - lastN).collect { it.tag }

        //println "Images to remove: ${imagesToRemove}"

        if (imagesToRemove) {
            // Remove old images
            def command = "docker rmi -f ${imagesToRemove.join(' ')}"
            println "Docker remove command: ${command}"
            sh command
            println "Removed old ${type} images, keeping the last ${lastN}."
        } else {
            println "All ${type} images are among the last ${lastN} images."
        }
    } else {
        println "No ${type} images found."
    }
}
