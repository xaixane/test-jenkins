pipeline {
    agent any

    tools {
        nodejs 'node24'
    }

    environment {
        IMAGE_NAME = 'taskmaster-api'
        IMAGE_TAG  = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
            post {
                always {
                    junit 'reports/junit/*.xml'
                }
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker rm -f taskmaster || true'
                sh "docker run -d --name taskmaster -p 3000:3000 ${IMAGE_NAME}:${IMAGE_TAG}"
            }
        }
    }

    post {
        failure {
            mail to: 'wooffcode@gmail.com',
                 subject: "FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: "Build #${env.BUILD_NUMBER} failed.\nDetails: ${env.BUILD_URL}console"
        }
        fixed {
            mail to: 'wooffcode@gmail.com',
                 subject: "BACK TO NORMAL: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: "Build #${env.BUILD_NUMBER} passed after an earlier failure.\nDetails: ${env.BUILD_URL}"
        }
    }
}
