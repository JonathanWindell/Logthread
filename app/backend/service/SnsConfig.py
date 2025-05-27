import boto3
from app.backend.service.SnsWrapper import SNSWrapper
from app.backend.config.settings import SNS_TOPIC_ARN

# Region och Topic ARN 
SNS_REGION = "eu-north-1"
TOPIC_ARN = SNS_TOPIC_ARN

sns_client = boto3.client("sns", region_name=SNS_REGION)
sns_wrapper = SNSWrapper(sns_client, topic_arn=TOPIC_ARN)

sns_region = SNS_REGION
sns_topic_arn = TOPIC_ARN
