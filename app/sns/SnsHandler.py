import boto3
from app.sns.SNSWrapper import SNSWrapper

# Konfiguration
SNS_REGION = "eu-north-1"
SNS_TOPIC_NAME = "LoggifyCritical"
SNS_TOPIC_ARN = "arn:aws:sns:eu-north-1:027625171538:Loggify:473d5bb4-5beb-43d8-bc9f-19a7ea78462c"

sns_client = boto3.client("sns", region_name=SNS_REGION)

# Använd antingen topic_name eller hårdkodad ARN
sns_wrapper = SNSWrapper(sns_client, topic_name=SNS_TOPIC_NAME, topic_arn=SNS_TOPIC_ARN)

def send_critical_notification(message: str, subject: str = "CRITICAL LOG"):
    return sns_wrapper.publish(subject=subject, message=message)