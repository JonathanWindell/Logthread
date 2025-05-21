# app/sns/SnsConfig.py
import boto3
from app.sns.SnsWrapper import SNSWrapper

# Region och Topic ARN 
SNS_REGION = "eu-north-1"
TOPIC_ARN = "arn:aws:sns:eu-north-1:027625171538:Loggify"

sns_client = boto3.client("sns", region_name=SNS_REGION)
sns_wrapper = SNSWrapper(sns_client, topic_arn=TOPIC_ARN)

sns_region = SNS_REGION
sns_topic_arn = TOPIC_ARN
