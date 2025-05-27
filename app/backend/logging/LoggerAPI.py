import boto3
from datetime import datetime, timezone
from botocore.exceptions import ClientError
import uuid

dynamodb = boto3.resource('dynamodb')
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

#Function for Global Secondary Index
