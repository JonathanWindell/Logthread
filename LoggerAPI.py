import boto3
from datetime import datetime, timezone
import uuid

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Logs')

def send_log(item: dict):
    """
    Skickar en färdigpaketerad dict till DynamoDB.
    Förväntar sig:
      {
        "log_id": str,
        "timestamp": str,
        "level": str,
        "message": str
      }
    """
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

#Function for Global Secondary Index
#Send logging data to database
#Function to get logs