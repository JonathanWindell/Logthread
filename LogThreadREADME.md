# Project Overview – LogThread

# 1: Vision & Scope
## Project Description
LogThread is a cloud-based logging service designed to streamline the way developers handle, view, and respond to application logs. Instead of combing through unstructured logs in the command line, Loggify enables centralized log management with clear filtering, real-time alerts, and a clean user interface.

## Motivation
The initial motivation comes from personal experience – managing logs locally becomes inefficient as projects grow. I first got the idea when learning Java and creating a logger that became the base for this project. You can find the MVP on my github. The goal is to build a serverless, scalable logging platform to simplify log access, monitoring, and alerting and really learning more about the cloud as I think it will give me a good foundation and headstart when entering the work field. The first version will be tailored for personal use, with future plans to open it up to fellow developers for feedback and enhancements. 

## Core Features
1: Log Collection: Send logs to a public API via a language-specific logger (starting with a Java-based MVP logger)
2: Cloud Storage: Save logs to either DynamoDB for structured search/filtering or Amazon S3 for low-cost archiving (optionally user-selectable)
3: Alerting: Notify users via email/SNS for critical logs (e.g., ERROR level)
4: User Interface: Web frontend to view, filter, and manage logs
5: Authentication: Secure login and user management with AWS Cognito
6: CI/CD: Automated deployment pipeline using GitHub Actions and Serverless Framework
7: Monitoring: Infrastructure and error monitoring via AWS CloudWatch

## Technology Stack
### Layer    Tool/Service
Backend:   Python + AWS Lambda + API Gateway
Storage:   DynamoDB (for structured logs), S3 (for archives)
Frontend:  React + Vite (lightweight and reactive UI)
Authentication:   AWS Cognito
CI/CD:  GitHub Actions + Serverless Framework
Monitoring:  SNS
Logger Client:  Python with Boto3

# 2: Planning & Design
## Architecture 

## Logflow & User login
The flows represent how the website/ app will transfer data through the layers. I’ve chosen AWS stack because it’s easier to get going. 

// Insert pictures
![image](https://github.com/user-attachments/assets/0f1fd5d9-bdce-4628-b235-e2e2b3d82c6b)
![image](https://github.com/user-attachments/assets/608e53ff-aef8-4ce3-9d74-e4b0933f6d7f)


## Architecture explained:
### Log gathering
1: Client sends logs to the REST endpoint through API Gateway.
2: API Gateway passes on to Lambda (LogHandler) that:
Validates logging data.
Adds metadata such as timestamp & user.
Saves in DynamoDB or S3 depending on structure and user choice. 

### Notifications
3: SNS is integrated which let's user decide which level of logs to activate SNS at. Default is CRITICAL

### Authentication & Frontend
4: Users login through Cognito Hosted UI.
5: Frontend calls GET / logs through API Gateway.
6: API endpoints retrieves data that is of relevance from DynamoDB and returns data to frontend.


