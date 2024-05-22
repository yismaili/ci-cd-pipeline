pipeline {
    agent any

    options {
        timeout(time: 1, unit: 'HOURS')
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '20', artifactNumToKeepStr: '10', daysToKeepStr: '30'))
    }

    environment {
        registry="localhost:5000"
        GIT_COMMIT_SHORT = sh(script: "git rev-parse --short ${GIT_COMMIT}", returnStdout: true).trim()
        STATUS="CD"
    }

    stages {

        stage('Checkout') {
            steps {
                git url: 'https://github.com/yismaili/ci-cd', branch: 'master'
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
                    // sh '''
                    //     echo "${GIT_COMMIT_SHORT}-${BUILD_NUMBER}" > latest.txt
                    //     cat latest.txt
                    //     echo "${GIT_COMMIT_SHORT}-${BUILD_NUMBER}" > ${GIT_COMMIT_SHORT}.txt
                    //     echo "${GIT_COMMIT_SHORT}.txt"
                    // '''            
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


        // stage('Pull Images on Target Host') {
        //     steps {
        //         script {
        //             // Pull frontend and backend images from the registry on the target host
        //             sh "docker pull ${REGISTRY}/${APPNAME}:frontend-${GIT_COMMIT_SHORT}-${BUILD_NUMBER}"
        //             sh "docker pull ${REGISTRY}/${APPNAME}:backend-${GIT_COMMIT_SHORT}-${BUILD_NUMBER}"
        //         }
        //     }
        // }

        // stage('Deploy on Target Host') {
        //     steps {
        //         script {
        //             // Deploy frontend and backend containers on the target host
        //             sh "docker run -d --name frontend ${REGISTRY}/${APPNAME}:frontend-${GIT_COMMIT_SHORT}-${BUILD_NUMBER}"
        //             sh "docker run -d --name backend ${REGISTRY}/${APPNAME}:backend-${GIT_COMMIT_SHORT}-${BUILD_NUMBER}"
        //         }
        //     }
        // }



        stage('Test') {
            steps {
                script {
                    sh 'echo "for testing application"'
                }
            }
        }

        stage('Establish a backup Frontend') {
            steps {
                dir('frontend') {
                    script {
                        sh '''
                            mkdir -p ${HOME}/backup/frontend
                            tar czvf ${HOME}/backup/frontend/${GIT_COMMIT_SHORT}-${BUILD_NUMBER}.tar.gz . 
                        '''
                    }
                }
            }
        }

        stage('Establish a backup Backend') {
            steps {
                dir('backend') {
                    script {
                        sh '''
                            mkdir -p ${HOME}/backup/backend
                            tar czvf ${HOME}/backup/backend/${GIT_COMMIT_SHORT}-${BUILD_NUMBER}.tar.gz .
                        '''
                    }
                }
            }
        }

        stage('Remove Unused Docker Images') {
            steps {
                script {
                    try {
                        def backendTags = sh(script: "docker images --format '{{.Repository}}:{{.Tag}}' | grep '${registry}/${APPNAME}:backend-' || true", returnStdout: true).trim().split('\n')
                        def frontendTags = sh(script: "docker images --format '{{.Repository}}:{{.Tag}}' | grep '${registry}/${APPNAME}:frontend-' || true", returnStdout: true).trim().split('\n')
                        
                        removeOldImages(backendTags, 3, "backend")
                        removeOldImages(frontendTags, 3, "frontend")

                    } catch (Exception e) {
                        println "Error during image cleanup: ${e.message}"
                    }
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    sh 'docker-compose build'
                   // sh 'docker-compose up'
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
            deleteDir() /* clean up our workspace */
        }
        success {
            echo 'I succeeded!'
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
    if (imageTags) {
        def buildNumbers = imageTags.collect { tag ->
            def parts = tag.split(':')
            def tagWithoutRepo = parts[2]
            def buildNumberPart = tagWithoutRepo.tokenize('-')[2]
            def buildNumber = buildNumberPart.isNumber() ? buildNumberPart.toInteger() : null
            [tag: tag, buildNumber: buildNumber]
        }

       // println "Build numbers for ${type}: ${buildNumbers}"

        // Ensure buildNumbers is sorted before accessing it
        buildNumbers.sort { a, b -> b.buildNumber <=> a.buildNumber }
        println "--${buildNumbers}--"

        // Ensure buildNumbers is defined before accessing it
        // def tagsToKeep = buildNumbers.take(lastN).collect { it.tag }
        // println "Tags to keep for ${type}: ${tagsToKeep}"

        // Ensure buildNumbers is defined before accessing it
        // def imagesToRemove = imageTags.findAll { tag -> !(tagsToKeep.contains(tag)) }
        // println "Images to remove for ${type}: ${imagesToRemove}"

        // if (imagesToRemove) {
        //     sh "docker rmi -f ${imagesToRemove.join(' ')}"
        //     println "Removed old ${type} images, keeping the last ${lastN}."
        // } else {
        //     println "All ${type} images are among the last ${lastN} images."
        // }
    } else {
        println "No ${type} images found."
    }
}
// def removeOldImages(imageTags, lastN, type) {
//     if (imageTags && imageTags.size() > 0) {
//         // Collect build numbers along with tags
//         def buildNumbers = imageTags.collect { tag ->
//             def parts = tag.split(':')
//             if (parts.size() > 1) {
//                 def tagWithoutRepo = parts[2]
//                 def buildNumberPart = tagWithoutRepo.tokenize('-')[2]
//                 def buildNumber = buildNumberPart.isNumber() ? buildNumberPart.toInteger() : null
//                 return [tag: tag, buildNumber: buildNumber]
//             } else {
//                 return [tag: tag, buildNumber: null]
//             }
//         }.findAll { it.buildNumber != null } // Filter out entries with null build numbers

//         println "Build numbers for ${type}: ${buildNumbers}"

//         // Sort build numbers in descending order manually
//         def sortedBuildNumbers = buildNumbers.sort { a, b -> b.buildNumber <=> a.buildNumber }
//         println "Sorted build numbers for ${type}: ${sortedBuildNumbers}"

//         // Take the top N build numbers
//         def tagsToKeep = sortedBuildNumbers.take(lastN).collect { it.tag }
//         println "Tags to keep for ${type}: ${tagsToKeep}"

//         // Find images to remove
//         def imagesToRemove = imageTags.findAll { tag -> !tagsToKeep.contains(tag) }
//         println "Images to remove for ${type}: ${imagesToRemove}"

//         if (imagesToRemove && imagesToRemove.size() > 0) {
//             sh "docker rmi -f ${imagesToRemove.join(' ')}"
//             println "Removed old ${type} images, keeping the last ${lastN} by build number."
//         } else {
//             println "All ${type} images are among the last ${lastN} images by build number."
//         }
//     } else {
//         println "No ${type} images found."
//     }
// }

// def removeOldImages(imageTags, lastN, type) {
//     if (imageTags && imageTags.size() > 0) {
//         // Collect build numbers along with tags
//         def buildNumbers = imageTags.collect { tag ->
//             def parts = tag.split(':')
//             if (parts.size() > 1) {
//                 def tagWithoutRepo = parts[2]
//                 def buildNumberPart = tagWithoutRepo.tokenize('-')[2]
//                 def buildNumber = buildNumberPart.isNumber() ? buildNumberPart.toInteger() : null
//                 return [tag: tag, buildNumber: buildNumber]
//             } else {
//                 return [tag: tag, buildNumber: null]
//             }
//         }.findAll { it.buildNumber != null } // Filter out entries with null build numbers

//        // println "Build numbers for ${type}: ${buildNumbers}"

//         // Manual sorting algorithm for buildNumbers in descending order
//         def sortedBuildNumbers = buildNumbers.sort { a, b -> b.buildNumber <=> a.buildNumber }
//         println "Sorted build numbers for ${type}: ${sortedBuildNumbers}"

//         // Take the top N build numbers
//         def tagsToKeep = sortedBuildNumbers.take(lastN).collect { it.tag }
//         println "Tags to keep for ${type}: ${tagsToKeep}"

//         // Find images to remove
//         def imagesToRemove = imageTags.findAll { tag -> !tagsToKeep.contains(tag) }
//         println "Images to remove for ${type}: ${imagesToRemove}"

//         if (imagesToRemove && imagesToRemove.size() > 0) {
//             sh "docker rmi -f ${imagesToRemove.join(' ')}"
//            // println "Removed old ${type} images, keeping the last ${lastN} by build number."
//         } else {
//            // println "All ${type} images are among the last ${lastN} images by build number."
//         }
//     } else {
//         println "No ${type} images found."
//     }
// }


