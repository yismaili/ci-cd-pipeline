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
                    // Get all backend and frontend image tags
                    def backendTags = sh(script: "docker images --format '{{.Repository}}:{{.Tag}}' | grep '${registry}/${APPNAME}:backend-'", returnStdout: true).trim().split('\n')
                    def frontendTags = sh(script: "docker images --format '{{.Repository}}:{{.Tag}}' | grep '${registry}/${APPNAME}:frontend-'", returnStdout: true).trim().split('\n')
                    
                    // Remove unused backend images except for the last 10
                    removeUnusedImages(backendTags, 10, "backend")
                    
                    // Remove unused frontend images except for the last 10
                    removeUnusedImages(frontendTags, 10, "frontend")
                }
            }
        }

        stage('Deployment') {
            steps {
                script {
                    sh 'docker compose build'
                    sh 'docker compose up -d'
                    sleep time: 20, unit: 'SECONDS'
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
def removeUnusedImages(imageTags, lastN, type) {
    if (imageTags) {
        // Extract build numbers from image tags
        def buildNumbers = imageTags.collect { tag ->
            def parts = tag.split('-')
            def buildNumberPart = parts[1]
            def buildNumber = buildNumberPart.isNumber() ? buildNumberPart.toInteger() : null
            [tag: tag, buildNumber: buildNumber]
        }

        // Print parts for debugging
        buildNumbers.each { println it }

        // Print buildNumber for debugging
        buildNumbers.each { println it.buildNumber }

        // Convert buildNumbers to a regular ArrayList
        def buildNumbersList = new ArrayList(buildNumbers)

        // Sort build numbers in ascending order
        buildNumbersList.sort { a, b -> a.buildNumber <=> b.buildNumber }

        // Print buildNumbers
        println "Build numbers: ${buildNumbersList}"

        // Get the image tags to keep
        def tagsToKeep = buildNumbersList.takeRight(lastN).collect { it.tag }
        
        // Remove unused images
        def imagesToRemove = imageTags.findAll { tag -> !(tagsToKeep.contains(tag)) }

        if (imagesToRemove) {
            sh "docker rmi -f ${imagesToRemove.join(' ')}"
            println "Removed ${type} images except for the last ${lastN}."
        } else {
            println "All ${type} images are among the last ${lastN} images."
        }
    } else {
        println "No ${type} images found."
    }
}



// def removeUnusedImages(imageTags, lastN, type) {
//     if (imageTags) {
//         // Extract build numbers from image tags
//         def buildNumbers = imageTags.collect { tag ->
//             def parts = tag.split('-')
//             def buildNumberPart = parts[1]
//             def buildNumber = buildNumberPart.isNumber() ? buildNumberPart.toInteger() : null
//             [tag: tag, buildNumber: buildNumber]
//             println "${parts}"
//         }

//         // Convert buildNumbers to a regular ArrayList
//         def buildNumbersList = new ArrayList(buildNumbers)

//         // Sort build numbers in ascending order
//         buildNumbersList.sort { a, b -> a.buildNumber <=> b.buildNumber }

//         // Print buildNumbers
//         println "Build numbers: ${buildNumbersList}"

//         // Get the image tags to keep
//         def tagsToKeep = buildNumbersList.takeRight(lastN).collect { it.tag }
        
//         // Remove unused images
//         def imagesToRemove = imageTags.findAll { tag -> !(tagsToKeep.contains(tag)) }

//         if (imagesToRemove) {
//             sh "docker rmi -f ${imagesToRemove.join(' ')}"
//             println "Removed ${type} images except for the last ${lastN}."
//         } else {
//             println "All ${type} images are among the last ${lastN} images."
//         }
//     } else {
//         println "No ${type} images found."
//     }
// }
