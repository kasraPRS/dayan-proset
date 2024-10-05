pipeline {
    agent any
    parameters {
      string (
           name: 'SPRINT_NUMBER',
           defaultValue: '0',
           description: 'Please insert sprint number , which is active. this version would be use as tag number. ( Example: Sprint number = 20 ).'
        )
    }
    options {
            // This is required if you want to clean before build
            skipDefaultCheckout(true)
    }
    tools {nodejs "nodejs"}
    environment {
            BRANCH_NAME = "${env.BRANCH_NAME}"
            BUILD_NUMBER = "${env.BUILD_NUMBER}"
            DOCKERHUB_CREDENTIALS = credentials('dockerhub')
        }
    stages {
        stage('Prepare Build ') {
           steps {
              // Clean before build
              cleanWs()
              // We need to explicitly checkout from SCM here
               checkout scm
               echo "Building ${env.JOB_NAME}..."
             }
           }
        stage('Check Branch Name') {
            when {
                expression {BRANCH_NAME != 'main'}
            }
            steps {
               echo "Checking branch format ........................"
               script{
                  BRANCH_TYPE = BRANCH_NAME.split("/")[0];
                  JIRA_TICKET = BRANCH_NAME.split("/")[1];
                  if(BRANCH_NAME == 'main' || BRANCH_TYPE == 'release') {
                  } else if(BRANCH_NAME != 'main' ){
                     if(BRANCH_TYPE == 'feature' || BRANCH_TYPE == 'Feature' || BRANCH_TYPE == 'bugfix' || BRANCH_TYPE == 'Bugfix') {
                        echo " ***************** Branch Type format passed *************************"
                     } else {
                        echo " ***************** Branch name format failed *************************"
                        exec.interrupt(Result.ABORTED, "Branch format fail")
                     }

                     if(JIRA_TICKET.startsWith('PRS-')) {
                         echo " ***************** Jira Ticket format passed *************************"
                       } else {
                          echo " ***************** Branch name format failed *************************"
                          exec.interrupt(Result.ABORTED, "Branch format fail")
                        }
                   }
                }
              }
            }
        stage('Build') {
             steps {
                 echo "Build starting ..................."
                  sh 'npm --version && node --version'
                  sh 'rm -f -r .angular && rm -f -r node_modules && rm -f -r package-lock.json'
                  sh 'npm cache clean --force'
                  sh 'npm install --legacy-peer-deps'
               }
        }
        stage('Check Prettier') {
           steps{
              echo "Prettier start ........................"
              sh 'npm run test:prettier'
           }
        }

        stage('Build  Docker image') {
            tools {nodejs "nodejs"}
             steps {
                 sh  'docker build -t dayan2023/proset-webapp:0.0.$SPRINT_NUMBER --no-cache --platform linux/amd64 -f Dockerfile .'
            }
        }

        stage('Push  Docker image') {
            when {
                  expression {BRANCH_NAME == 'main'}
            }
            tools {nodejs "nodejs"}
               steps {
                 sh  'docker push  dayan2023/proset-webapp:0.0.$SPRINT_NUMBER'
             }
        }

        stage('Deploy to Server') {
            tools {nodejs "nodejs"}
            when {
                   expression {BRANCH_NAME == 'main'}
             }
              steps {
                  sh  'docker stop proset-webapp'
                  sh  'docker  rm  proset-webapp'
                  sh  'docker run -p 4200:80  --name proset-webapp -d dayan2023/proset-webapp:0.0.$SPRINT_NUMBER'
                  sh  'docker image prune -a --force'
             }
        }

        stage('Create Document & update main branch') {
            tools {nodejs "nodejs"}
            when {
                   expression {BRANCH_NAME == 'main'}
            }
               steps {
                  sh  'npm run generate-docs'
              }
        }
    }
}
