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

![JSON Response](./pictures/APIEndpointLogs.png)
    
## .Env variables
### Security Note

- Do **not** commit `.env` or access keys to GitHub.
- Use `.gitignore` and secrets manager in production.
  
User must create IAM user, SNS & Cognito to get access to number of keys to be able to use LogThread

#.gitignore

#AWS config
AWS_REGION=YOUR_REGION_HERE

AWS_ACCESS_KEY_ID=YOUR_KEY_HERE

AWS_SECRET_ACCESS_KEY=YOUR_KEY_HERE

#SNS config
SNS_TOPIC_ARN=YOUR_ARN_HERE

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

