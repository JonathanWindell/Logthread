import json
import boto3
from datetime import datetime, timedelta
from boto3.dynamodb.conditions import Attr
from app.backend.config.settings import AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, REGION

# Initialize AWS resources
dynamodb = boto3.resource(
    'dynamodb',
    region_name=REGION,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY
)

table = dynamodb.Table('Logs')

s3 = boto3.client(
    's3',
    region_name=REGION,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY
)

def archive_old_logs():
    """
    Archives logs from DynamoDB to S3 based on age and a retention threshold.

    The function performs a two-step process:
    1. Counts total logs in DynamoDB. If 200 or fewer exist, archiving is skipped.
    2. If over 200 logs exist, it identifies logs older than 30 days and moves 
       them to S3 until only 200 logs remain or no more old logs are found.

    Args:
        None

    Returns:
        dict: A summary containing the number of logs successfully 'archived'.

    Raises:
        ClientError: If DynamoDB scan/delete or S3 put_object operations fail.
        Exception: For general processing errors during JSON serialization or logic.
    """
    # Get all logs
    total_logs = 0
    last_evaluated_key = None
    while True:
        scan_args = {}
        if last_evaluated_key:
            scan_args['ExclusiveStartKey'] = last_evaluated_key
        response = table.scan(**scan_args)
        total_logs += len(response.get('Items', []))
        last_evaluated_key = response.get('LastEvaluatedKey')
        if not last_evaluated_key:
            break

    # Count if total logs are under 200 no archive
    if total_logs <= 200:
        print("200 eller färre loggar i DynamoDB, arkivering avbryts.")
        return {"archived": 0}

    # Count number of logs to archive
    to_archive = total_logs - 200
    thirty_days_ago = (datetime.utcnow() - timedelta(days=30)).isoformat()
    archived = 0
    last_evaluated_key = None

    # Scan for logs older than 30 days
    while archived < to_archive:
        scan_kwargs = {
            'FilterExpression': Attr('timestamp').lt(thirty_days_ago),
            'Limit': 50  # Set limit for each scan
        }
        if last_evaluated_key:
            scan_kwargs['ExclusiveStartKey'] = last_evaluated_key

        response = table.scan(**scan_kwargs)
        old_logs = response.get('Items', [])
        last_evaluated_key = response.get('LastEvaluatedKey')

        if not old_logs:
            break 

        for log in old_logs:
            if archived >= to_archive:
                break
            filename = f"{log['log_id']}.json"
            s3.put_object(
                Bucket="mylogthreadbucket",
                Key=f"archived/{filename}",
                Body=json.dumps(log)
            )
            table.delete_item(Key={'log_id': log['log_id']})
            archived += 1

        if not last_evaluated_key:
            break

    print(f"Archived {archived} logs.")
    return {"archived": archived}