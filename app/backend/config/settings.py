import os
from dotenv import load_dotenv

load_dotenv()

#Get keys from .env file and set as environment variables
REGION = os.getenv("AWS_REGION")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
CLIENT_ID = os.getenv("CLIENT_ID")
USER_POOL_ID = os.getenv("USER_POOL_ID")
SECRET_KEY = os.getenv("SECRET_KEY")
SNS_TOPIC_ARN = os.getenv("SNS_TOPIC_ARN")
DEBUG = os.getenv("DEBUG", "false").lower() == "true"

JWK_URL = f"https://cognito-idp.{REGION}.amazonaws.com/{USER_POOL_ID}/.well-known/jwks.json"
