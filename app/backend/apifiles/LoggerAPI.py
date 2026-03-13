import boto3
import os
import uuid
from app.backend.config.settings import AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, REGION
from datetime import datetime, timezone
from collections import defaultdict
from botocore.exceptions import ClientError

# Initialize AWS services
dynamodb = boto3.resource(
    'dynamodb',
    region_name=REGION,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY
)

s3 = boto3.client(
    's3',
    region_name=REGION,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY
)

table = dynamodb.Table('Logs')

def send_log(item: dict):
    """
    Writes a new log entry to the DynamoDB table.

    Args:
        item (dict): A dictionary representing the log record, including required keys like 'log_id'.

    Returns:
        None
    """
    table.put_item(Item=item)

def get_log(log_id: str):
    """
    Retrieves a specific log entry from DynamoDB by its unique ID.

    Args:
        log_id (str): The unique identifier for the log entry.

    Returns:
        dict: The log item if found, otherwise None.

    Raises:
        Exception: If there is an error communicating with the DynamoDB resource.
    """
    try:
        response = table.get_item(
            Key = {
                'log_id': log_id
            }
        )
        return response.get('Item')
    except Exception as e:
        print(f"Error fetching log: {e}")
        return None

def get_all_items():
    """
    Performs a full table scan to retrieve all log entries.

    Note: This is an expensive operation for large tables and should be used sparingly.

    Returns:
        list: A list of dictionaries representing all items in the table.

    Raises:
        ClientError: If the scan operation fails due to AWS service limits or permissions.
    """
    try:
        response = table.scan()
        return response.get('Items', [])
    except ClientError as e:
        print(f"Error: {e}")
        return []

def get_logs_by_level(level: str):
    """
    Filters logs based on their severity level using a table scan.

    Args:
        level (str): The severity level to filter by (e.g., 'INFO', 'ERROR').

    Returns:
        list: A list of log items matching the specified level.

    Raises:
        ClientError: If the filtered scan operation fails.
    """
    try:
        response = table.scan(
            FilterExpression='#level = :level_value',
            ExpressionAttributeNames={'#level': 'level'},
            ExpressionAttributeValues={':level_value': level.upper()}
        )
        return response.get('Items', [])
    except ClientError as e:
        print(f"Error querying by level: {e}")
        return []

def get_number_of_logs_per_level():
    """
    Aggregates the total count of logs for each predefined severity level.

    Uses the 'Select=COUNT' parameter to minimize data transfer by not retrieving full items.

    Returns:
        dict: A mapping of log levels to their respective counts.

    Raises:
        ClientError: If the counting operation fails during any of the level scans.
    """
    levels = ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL']
    counts = {}
    
    try:
        for level in levels:
            response = table.scan(
                FilterExpression='#level = :level_value',
                ExpressionAttributeNames={'#level': 'level'},
                ExpressionAttributeValues={':level_value': level},
                Select='COUNT'
            )
            counts[level] = response.get('Count', 0)
        
        return counts
    except ClientError as e:
        print(f"Error: {e}")
        return {}

def get_archived_log_count_s3():
    """
    Counts the number of archived log files stored in the S3 bucket.

    Args:
        None (Uses environment/config bucket names).

    Returns:
        int: The total number of objects found under the 'archived/' prefix.

    Raises:
        Exception: If the S3 list_objects_v2 call fails.
    """
    try:
        response = s3.list_objects_v2(Bucket="mylogthreadbucket", Prefix="archived/")
        objects = response.get("Contents", [])
        return len(objects)
    except Exception as e:
        print(f"Error counting archived logs: {e}")
        return 0

def get_item_by_id(item_id: str):
    """
    A utility wrapper to fetch a log by its ID.

    Args:
        item_id (str): The unique identifier for the log.

    Returns:
        dict: The log item retrieved from DynamoDB.
    """
    return get_log(item_id)

def query_items_by_user(user_id: str):
    """
    Searches for all logs associated with a specific user ID.

    Args:
        user_id (str): The unique identifier of the user.

    Returns:
        list: A list of logs attributed to the user.

    Raises:
        ClientError: If the scan with FilterExpression fails.
    """
    try:
        response = table.scan(
            FilterExpression='attribute_exists(user_id) AND user_id = :uid',
            ExpressionAttributeValues={':uid': user_id}
        )
        return response.get('Items', [])
    except ClientError as e:
        print(f"Error querying by user: {e}")
        return []