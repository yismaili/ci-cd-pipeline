pipeline {
    agent any

    stages {
        stage('Build and Push Backend Image') {
            steps {
                script {
                    docker.build("backend-image", "./src/dck-b")
                    docker.withRegistry('https://your-docker-registry', 'docker-credentials-id') {
                        docker.image("backend-image").push("latest")
                    }
                }
            }
        }

        stage('Build and Push Frontend Image') {
            steps {
                script {
                    docker.build("frontend-image", "./src/dck-f")
                    docker.withRegistry('https://your-docker-registry', 'docker-credentials-id') {
                        docker.image("frontend-image").push("latest")
                    }
                }
            }
        }

        stage('Deploy Services') {
            steps {
                script {
                    docker.withRegistry('https://your-docker-registry', 'docker-credentials-id') {
                        dockerCompose(
                            services: [
                                "postgres_db",
                                "backend",
                                "frontend"
                            ],
                            dockerComposeFile: 'docker-compose.yml',
                            build: true
                        )
                    }
                }
            }
        }
    }
}
