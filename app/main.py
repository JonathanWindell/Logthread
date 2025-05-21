#from app.Logger import Logger
#from app.LoggerEnum import LoggerEnum
#from fastapi import FastAPI
#from app.auth.Router import router as auth_router

# app/main.py
# app/main.py
from app.sns.SnsHandler import send_critical_notification

if __name__ == "__main__":
    # Testmeddelande till SNS
    message = "Detta är ett testmeddelande från main.py för att bekräfta SNS-funktionalitet."
    send_critical_notification(message)



"""
sns_client = boto3.client("sns", region_name="eu-north-1")
sns = SNSWrapper(sns_client, topic_name="LoggifyCritical")

sns.publish(
    subject="Enkel SNS-test",
    message="Testar SNS direkt från main.py utan funktion."
)
"""


#Test call to dynamoDB
"""
logger = Logger(level=LoggerEnum.DEBUG)

logger.log("Test message", LoggerEnum.INFO)
"""

#Test with fastAPI for frontend 
"""
app = FastAPI()
app.include_router(auth_router)

@app.get("/")
def read_root():
    return {"message": "Loggify API is running!"}
"""