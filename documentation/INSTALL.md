# Installation Guide – LogThread

This guide will help you set up and run the project locally.

---

## Prerequisites

- Python **3.12+**
- Node.js (for the frontend)
- AWS account with access to:
  - Cognito User Pool & App Client
  - SNS Topic
  - IAM user with permissions for Cognito, SNS, and DynamoDB

---

## Backend Setup

### 1. Clone the repository
git clone https://github.com/your-account/logthread.git
cd logthread

### 2. Create virtual enviroment
python -m venv venv
source venv/bin/activate   # macOS/Linux
venv\Scripts\activate      # windows

### 3. Install dependencies

pip install -r requirements.txt

### 4. Create .env file

#### AWS config
AWS_REGION=your-region

AWS_ACCESS_KEY_ID=your-access-key

AWS_SECRET_ACCESS_KEY=your-secret-key

#### SNS config
SNS_TOPIC_ARN=your-sns-topic-arn

#### Cognito config
COGNITO_REGION=your-region

CLIENT_ID=your-client-id

USER_POOL_ID=your-user-pool-id

SECRET_KEY=your-secret-key

DEBUG=true

### Important: Never commit .env or access keys to GitHub. It should be ignored via .gitignore.

### 5. Start FastAPI server

uvicorn main:app --reload

The backend will now run at:

http://localhost:8000

Swagger Docs: http://localhost:8000/docs


## Frontend Setup

### 1. Navigate to frontend folder

cd frontend

### 2. Install frontend dependencies

npm install

### 3. Start the development server

npm run dev

The frontend will now run at:

http://localhost:5173

### Test Logging
Send a POST request to /api/logs with a JSON log payload.

Open the frontend UI to see logs displayed.

Try different log levels (INFO, WARNING, ERROR, CRITICAL).

Check if SNS gets triggered for CRITICAL logs (if configured).

### Additional Notes
Your .gitignore should include:
venv/, 
.env, 
__pycache__/, 
node_modules/

The project uses DynamoDB and optionally S3 for log storage. Make sure those services are set up in your AWS account.

### Questions?
If you run into issues, feel free to contact Jonathan Windell (Me) or open an issue in the repository.




