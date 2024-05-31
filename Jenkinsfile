
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
            STATUS = "Deploy"
            ITEMNAME = "test2"
            REPO_URL = "https://github.com/yismaili/ci-cd"
            BRANCH = "master"
        }

        stages {
            stage('Checkout') {
                steps {
                    git url: "${env. REPO_URL}", branch: "${env.BRANCH}"
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

        stage('Test') {
            steps {
                script {
                    sh 'echo "for testing application"'
                }
            }
        }

        stage('Send the frontend to the production environment') {
            steps {
                dir('frontend') {
                        def frontendTag = "${REGISTRY}/${APPNAME}:frontend-${GIT_COMMIT_SHORT}-${BUILD_NUMBER}"
                        sh """
                        echo "Committing and Saving Frontend Image"
                        docker commit $(docker ps -q --filter "ancestor=${frontendTag}") ${frontendTag}
                        docker save -o frontend-${GIT_COMMIT_SHORT}-${BUILD_NUMBER}.tar ${frontendTag}
                        scp frontend-${GIT_COMMIT_SHORT}-${BUILD_NUMBER}.tar root@192.168.100.76:/home/
                        """
                }
            }
        }

        stage('Send the backend to the production environment') {
            steps {
                dir('backend') {
                        def backendTag = "${REGISTRY}/${APPNAME}:backend-${GIT_COMMIT_SHORT}-${BUILD_NUMBER}"
                        sh """
                        echo "Committing and Saving Backend Image"
                        docker commit $(docker ps -q --filter "ancestor=${backendTag}") ${backendTag}
                        docker save -o backend-${GIT_COMMIT_SHORT}-${BUILD_NUMBER}.tar ${backendTag}
                        scp backend-${GIT_COMMIT_SHORT}-${BUILD_NUMBER}.tar root@192.168.100.76:/home/
                        """
                }
            }
        }


        stage('Build') {
            steps {
                script {
                    sh 'docker-compose build'
                    if (env.STATUS == 'Deploy') {
                        sh 'docker-compose down'
                        sh 'docker-compose up -d'
                    }
                }
            }
        }

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
                if (env.STATUS == 'Deployment') {
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
