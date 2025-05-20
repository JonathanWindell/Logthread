#from app.Logger import Logger
#from app.LoggerEnum import LoggerEnum
from fastapi import FastAPI
from app.auth.Router import router as auth_router

app = FastAPI()
app.include_router(auth_router)

@app.get("/")
def read_root():
    return {"message": "Loggify API is running!"}

"""
logger = Logger(level=LoggerEnum.DEBUG)

logger.log("Test message", LoggerEnum.INFO)
"""