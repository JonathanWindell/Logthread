import logging
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)

# Wrapper class for AWS SNS (Simple Notification Service) operations
class SNSWrapper:
    def __init__(self, sns_client, topic_arn: str):
        self.sns = sns_client  # Boto3 SNS client instance
        self.topic_arn = topic_arn  # Target SNS topic ARN

    def publish(self, subject: str, message: str) -> dict:
        # Send notification to SNS topic with subject and message
        try:
            response = self.sns.publish(
                TopicArn=self.topic_arn,
                Subject=subject,
                Message=message
            )
            logger.info(f"Message sent to. ID: {response['MessageId']}")
            return response
        except ClientError as error:
            logger.error(f"Could not send message!: {error}")
            raise
