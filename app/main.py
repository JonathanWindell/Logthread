#from app.Logger import Logger
#from app.LoggerEnum import LoggerEnum
#from fastapi import FastAPI
#from app.auth.Router import router as auth_router
from app.logging.MessageFormatter import MessageFormatter
from app.LoggerEnum import LoggerEnum

if __name__ == "__main__":
    MessageFormatter.log_message(LoggerEnum.CRITICAL, "En allvarlig händelse inträffade!")

sns.publish(subject="Test", message="Funkar SNS?")


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