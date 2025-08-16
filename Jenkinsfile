pipeline {
    agent any
    
    tools {
        jdk 'jdk-21'
        maven 'maven-3.9'
    }
    
    environment {
        DOCKER_COMPOSE_FILE = 'docker/docker-compose.yml'
        ENV_FILE = 'env/dev/.root.env'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }
        
        stage('Unit Tests') {
            steps {
                echo 'Running unit tests...'
                sh '''
                    mvn clean test \
                        -DskipTests=false \
                        -DskipITs=true \
                        -Dmaven.test.failure.ignore=false
                '''
            }
            post {
                always {
                    publishTestResults testResultsPattern: '**/target/surefire-reports/*.xml'
                }
            }
        }
        
        stage('Integration Tests') {
            steps {
                echo 'Running integration tests with Testcontainers...'
                sh '''
                    mvn verify \
                        -DskipTests=true \
                        -DskipITs=false \
                        -Dmaven.test.failure.ignore=false
                '''
            }
            post {
                always {
                    publishTestResults testResultsPattern: '**/target/failsafe-reports/*.xml'
                }
            }
        }
        
        stage('Build & Deploy (Dev)') {
            steps {
                echo 'Building and deploying to dev environment...'
                sh '''
                    # Stop existing containers
                    docker compose -f ${DOCKER_COMPOSE_FILE} --env-file ${ENV_FILE} down || true
                    
                    # Build and start all services
                    docker compose -f ${DOCKER_COMPOSE_FILE} --env-file ${ENV_FILE} up -d --build
                    
                    # Wait for services to be healthy
                    echo "Waiting for services to start..."
                    sleep 60
                    
                    # Check service health
                    docker compose -f ${DOCKER_COMPOSE_FILE} --env-file ${ENV_FILE} ps
                '''
            }
        }
        
        stage('Health Check') {
            steps {
                echo 'Performing health checks...'
                script {
                    def services = [
                        'gateway': 'http://localhost:8080/actuator/health',
                        'auth': 'http://localhost:8081/actuator/health',
                        'catalog': 'http://localhost:8082/actuator/health',
                        'seller': 'http://localhost:8083/actuator/health',
                        'review': 'http://localhost:8084/actuator/health',
                        'search': 'http://localhost:8085/actuator/health',
                        'order-payment': 'http://localhost:8086/actuator/health',
                        'notification': 'http://localhost:8087/actuator/health'
                    ]
                    
                    services.each { name, url ->
                        retry(5) {
                            sh "curl -f ${url} || exit 1"
                            echo "${name} service is healthy"
                        }
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up...'
            sh '''
                # Collect logs for debugging
                mkdir -p logs
                docker compose -f ${DOCKER_COMPOSE_FILE} --env-file ${ENV_FILE} logs > logs/docker-compose.log || true
            '''
            archiveArtifacts artifacts: 'logs/**', allowEmptyArchive: true
        }
        
        failure {
            echo 'Pipeline failed! Collecting debug information...'
            sh '''
                docker compose -f ${DOCKER_COMPOSE_FILE} --env-file ${ENV_FILE} ps
                docker compose -f ${DOCKER_COMPOSE_FILE} --env-file ${ENV_FILE} logs --tail=50
            '''
        }
        
        success {
            echo 'Pipeline completed successfully!'
            echo 'Dev environment is running at: http://localhost:8080'
        }
    }
}
