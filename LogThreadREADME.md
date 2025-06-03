# Project Overview – LogThread

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


