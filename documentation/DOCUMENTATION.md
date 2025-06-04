# Documentation

## API Endpoints
http://localhost:8000/api/logs - All logs

http://localhost:8000/api/logs/{log_id} - Specific log

http://localhost:8000/api/users/{user_id}/logs - Logs based on user (Not implemented)

http://localhost:8000/docs - FastAPI documentation

http://localhost:8000/api/logs/level/CRITICAL (Can be changed based on log table displaying one level of logs)

http://localhost:8000/api/logs/stats (Count and percentage of every level of logs) 

http://localhost:8000/api/archived/count (If S3 buckets hold archived logs)

### Example JSON response

#### API Endpoint: http://localhost:8000/api/logs

logs": [
    {
      "log_id": "8ef96028-66a9-455d-9e30-86a99fff1053",
      "message": "Testmeddelande: INFO-nivå",
      "level": "INFO",
      "timestamp": "2025-05-22T04:30:31.217900+00:00"
    },
    {
      "log_id": "7e639611-342e-49f5-91bb-18bf0645e315",
      "message": "Testmeddelande: INFO-nivå",
      "level": "INFO",
      "timestamp": "2025-05-22T03:52:37.039962+00:00"
    },
    {
      "log_id": "bce8818d-6fc5-4a28-bc46-c52a4b13e434",
      "message": "Testmeddelande: WARNING-nivå",
      "level": "WARNING",
      "timestamp": "2025-06-03T14:37:43.972549+00:00"
    },
    Continuation...
    
## .Env variables
### Security Note

- Do **not** commit `.env` or access keys to GitHub.
- Use `.gitignore` and secrets manager in production.
  
User must create IAM user, SNS & Cognito to get access to number of keys to be able to use LogThread

#.gitignore

#AWS config
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

#SNS config
SNS_TOPIC_ARN=

#Cognito config
COGNITO_REGION=
CLIENT_ID=
USER_POOL_ID=
SECRET_KEY=
DEBUG=true

## Log Levels

| Level     | Description                                |
|-----------|--------------------------------------------|
| DEBUG     | Verbose logs used for debugging            |
| INFO      | General operational entries                |
| WARNING   | Unexpected behavior, not breaking the flow |
| ERROR     | Errors that affect functionality           |
| CRITICAL  | Severe errors, system might crash          |

