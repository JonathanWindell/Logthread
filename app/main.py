from app.Logger import Logger
from app.LoggerEnum import LoggerEnum
from fastapi import FastAPI
from app.auth.Router import auth

app = FastAPI()
app.include_router(auth.router)

logger = Logger(level=LoggerEnum.DEBUG)

logger.log("Test message", LoggerEnum.INFO)