import boto3
import os
import uuid
from app.backend.config.settings import AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, REGION
from datetime import datetime, timezone
from collections import defaultdict
from botocore.exceptions import ClientError

dynamodb = boto3.resource(
    'dynamodb',
    region_name=REGION,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY
)

table = dynamodb.Table('Logs')

def send_log(item: dict):
    table.put_item(Item=item)

def get_log(log_id):
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
    try:
        response = table.scan()
        return response.get('Items', [])
    except ClientError as e:
        print(f"Error: {e}")
        return []

def get_logs_by_level(level: str):
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

#Will you implement this?
def get_item_by_id(item_id: str):
    return get_log(item_id)

#Will you implement this?
def query_items_by_user(user_id: str):
    try:
        response = table.scan(
            FilterExpression='attribute_exists(user_id) AND user_id = :uid',
            ExpressionAttributeValues={':uid': user_id}
        )
        return response.get('Items', [])
    except ClientError as e:
        print(f"Error querying by user: {e}")
        return []