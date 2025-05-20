import logging
import boto3
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)

class SNSWrapper:
    def __init__(self, sns_client, topic_name: str = None, topic_arn: str = None):
        self.sns = sns_client
        if topic_arn:
            self.topic_arn = topic_arn
            self.topic_name = topic_name or topic_arn.split(":")[-1]
        else:
            self.topic_name = topic_name
            self.topic_arn = self.ensure_topic_exists()