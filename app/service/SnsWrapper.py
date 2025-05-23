import logging
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)

class SNSWrapper:
    def __init__(self, sns_client, topic_arn: str):
        self.sns = sns_client
        self.topic_arn = topic_arn

    def publish(self, subject: str, message: str) -> dict:
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
