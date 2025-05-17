from boto3 import resource
from datetime import datetime
import uuid

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Logs')

def send_log(level, message):
    item = {
        'log_id': str(uuid.uuid4()),
        'timestamp': datetime.timezone.now().isoformat(),
        'level': level,
        'message': message
    }
    table.put_item(Item=item)

def get_log(log_id):
    try:
        response = table.get_Item(
            Key = {
                'log_id': log_id
            }
        )
        return response.get('Item')
    except Exception as e:
        print(f"Error fetching log: {e}")
        return None

    


#Send logging data to database
#Function to get logs