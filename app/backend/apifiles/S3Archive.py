import json
import boto3
from datetime import datetime, timedelta
from boto3.dynamodb.conditions import Attr
from app.backend.config.settings import AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, REGION

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
    thirty_days_ago = (datetime.utcnow() - timedelta(days=30)).isoformat()
    archived = 0
    last_evaluated_key = None

    while True:
        scan_kwargs = {
            'FilterExpression': Attr('timestamp').lt(thirty_days_ago)
        }
        if last_evaluated_key:
            scan_kwargs['ExclusiveStartKey'] = last_evaluated_key

        response = table.scan(**scan_kwargs)
        old_logs = response.get('Items', [])

        for log in old_logs:
            filename = f"{log['log_id']}.json"
            s3.put_object(
                Bucket="mylogthreadbucket",
                Key=f"archived/{filename}", 
                Body=json.dumps(log)
            )
            archived += 1

        last_evaluated_key = response.get('LastEvaluatedKey')
        if not last_evaluated_key:
            break

    print(f"Archived {archived} logs.")
    return {"archived": archived}

if __name__ == "__main__":
    archive_old_logs()
