
pipeline {
    agent any
    options {
        timeout(time: 1, unit: 'HOURS')
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '20', artifactNumToKeepStr: '10', daysToKeepStr: '30'))
    }
     parameters {
        string(name: 'ITEMNAME', defaultValue: 'test2', description: 'Item name')
        string(name: 'BUILD_STATUS', defaultValue: 'CI', description: 'Build status')
        string(name: 'BRANCH', defaultValue: 'master', description: 'Branch name')
        string(name: 'NEXUS_ARTEFACT_CREDENTIALS', defaultValue: 'nexus-credentials-id', description: 'Nexus credentials ID')
        string(name: 'GIT_CREDENTIALS_ID', defaultValue: 'github-pat', description: 'Git credentials ID')
        string(name: 'NEXUS_ARTEFACT_URL', defaultValue: '192.168.100.75:8585', description: 'Nexus artifact URL')
        string(name: 'REPOSITORY_FRONTEND', defaultValue: 'ci-cd/frontend', description: 'Frontend repository')
        string(name: 'REPOSITORY_BACKEND', defaultValue: 'ci-cd/backend', description: 'Backend repository')
        string(name: 'IMAGES_TO_KEEP', defaultValue: '3', description: 'Number of Docker images to keep')
    }

    environment {
        GIT_COMMIT_SHORT = sh(script: "git rev-parse --short ${GIT_COMMIT}", returnStdout: true).trim()
        BUILD_STATUS = "CI"
        ITEMNAME = "${params.ITEMNAME}"
        REPO_URL = "https://github.com/yismaili/ci-cd"
        BRANCH = "${params.BRANCH}"
        NEXUS_ARTEFACT_CREDENTIALS = "${params.NEXUS_ARTEFACT_CREDENTIALS}"
        NEXUS_ARTEFACT_URL = "${params.NEXUS_ARTEFACT_URL}"
        GIT_CREDENTIALS_ID = "${params.GIT_CREDENTIALS_ID}"
        REPOSITORY_FRONTEND = "${params.REPOSITORY_FRONTEND}"
        REPOSITORY_BACKEND = "${params.REPOSITORY_BACKEND}"
        IMAGES_TO_KEEP = "${params.IMAGES_TO_KEEP}"
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
                    }
                }
            }

            stage('Preparing Frontend') {
                steps {
                    script {
                        dir('frontend') {
                            def frontendTag = "${REPOSITORY_FRONTEND}:frontend-${GIT_COMMIT_SHORT}-${BUILD_NUMBER}"
                            sh """
                            echo "Preparing Frontend"
                            docker build -t ${frontendTag} .
                            cd ..
                            echo "FRONTEND_IMAGE=${frontendTag}" >> .env
                            """
                        }
                    }
                }
            }

            stage('Preparing Backend') {
                steps {
                    script {
                        dir('backend') {
                            def backendTag = "${REPOSITORY_BACKEND}:backend-${GIT_COMMIT_SHORT}-${BUILD_NUMBER}"
                            sh """
                            echo "Preparing Backend"
                            docker build -t ${backendTag} .
                            cd ..
                            echo "BACKEND_IMAGE=${backendTag}" >> .env
                            """
                        }
                    }
                }
            }

            stage('Test') {
                steps {
                    script {
                        sh 'echo ":/"'
                    }
                }
            }

            // stage('Build') {
            //     steps {
            //         script {
            //             sh 'docker-compose build'
            //             if (env.BUILD_STATUS == 'CI') {
            //                 sh 'docker-compose down'
            //                 sh 'docker-compose up -d'
            //             }
            //         }
            //     }
            // }

            stage('Tag and Push Backend Image to Nexus') {
                steps {
                    script {
                        def backendTag = "${REPOSITORY_BACKEND}:backend-${env.GIT_COMMIT_SHORT}-${env.BUILD_NUMBER}"
                        def nexusBackendTag = "${NEXUS_ARTEFACT_URL}/ci-cd/backend:backend-${env.GIT_COMMIT_SHORT}-${env.BUILD_NUMBER}"

                        sh "docker tag ${backendTag} ${nexusBackendTag}"

                        withDockerRegistry([url: "http://${env.NEXUS_ARTEFACT_URL}", credentialsId: env.NEXUS_ARTEFACT_CREDENTIALS]) {
                            sh "docker push ${nexusBackendTag}"
                        }
                        sh "docker rmi ${nexusBackendTag}"
                    }
                }
            }

            stage('Tag and Push Frontend Image to Nexus') {
                steps {
                    script {
                        def frontendTag = "${REPOSITORY_FRONTEND}:frontend-${env.GIT_COMMIT_SHORT}-${env.BUILD_NUMBER}"
                        def nexusFrontendTag = "${NEXUS_ARTEFACT_URL}/ci-cd/frontend:frontend-${env.GIT_COMMIT_SHORT}-${env.BUILD_NUMBER}"

                        sh "docker tag ${frontendTag} ${nexusFrontendTag}"

                        withDockerRegistry([url: "http://${env.NEXUS_ARTEFACT_URL}", credentialsId: env.NEXUS_ARTEFACT_CREDENTIALS]) {
                            sh "docker push ${nexusFrontendTag}"
                        }
                        sh "docker rmi ${nexusFrontendTag}"
                    }
                }
            }

            stage('Remove Unused Docker Images') {
                steps {
                    script {
                        try {
                            
                            def backendTags = sh(script: "docker images --format '{{.Repository}}:{{.Tag}}' | grep '${REPOSITORY_BACKEND}' || true", returnStdout: true).trim().split('\n').findAll { it }
                            def frontendTags = sh(script: "docker images --format '{{.Repository}}:{{.Tag}}' | grep '${REPOSITORY_FRONTEND}' || true", returnStdout: true).trim().split('\n').findAll { it }
                            
                            removeOldImages(backendTags, env.IMAGES_TO_KEEP, "backend")
                            removeOldImages(frontendTags, env.IMAGES_TO_KEEP, "frontend")

                        } catch (Exception e) {
                            println "Error during image cleanup: ${e.message}"
                        }
                    }
                }
            }

            // stage('Deployment') {
            //     steps {
            //         script {
            //             if (env.BUILD_STATUS == 'CD') {
            //                 sh 'ansible-playbook -i inventory.yml deploy.yaml'
            //             }
            //         }
            //     }
            // }
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
    println "Input imageTags: ${imageTags}"
    println "Input lastN: ${lastN}"
    println "Input type: ${type}"

    if (imageTags) {
       // Split build numbers from image tags
        def buildNumbers = imageTags.collect { tag ->
            try {
                def parts = tag.split(':')
                //println "Tag parts: ${parts}"
                def tagWithoutRepo = parts[1]
                //println "Tag without repo: ${tagWithoutRepo}"
                def part_numbers = tagWithoutRepo.split('-')
                def buildNumberPart = part_numbers[2]
                //println "Build number part: ${buildNumberPart}"
                def buildNumber = buildNumberPart?.toInteger()
               // println "Build number: ${buildNumber}"
                [tag: tag, buildNumber: buildNumber]
            } catch (Exception e) {
                println "Error parsing tag: ${tag}, error: ${e.message}"
                [tag: tag, buildNumber: null]
            }
        }.findAll { it.buildNumber != null }
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
