from app.backend.logging.Logger import Logger
from app.backend.logging.LoggerEnum import LoggerEnum
from app.backend.service.SnsHandler import send_critical_notification
from app.backend.apifiles.Routers import router as logs_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

app = FastAPI()

app.include_router(logs_router, prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],  
)

@app.get("/")
def read_root():
    return {"message": "Loggify API is running!"}

def test_logging():
    # Create logger instance
    logger = Logger(level=LoggerEnum.DEBUG)
    
    #Log to dynamoDB
    logger.log("Testmeddelande: DEBUG-nivå", LoggerEnum.DEBUG)
    logger.log("Testmeddelande: ERROR-nivå", LoggerEnum.ERROR)
    logger.log("Testmeddelande: WARNING-nivå", LoggerEnum.WARNING)
    logger.log("Testmeddelande: WARNING-nivå", LoggerEnum.WARNING)
    logger.log("Testmeddelande: DEBUG-nivå", LoggerEnum.DEBUG)
    logger.log("Testmeddelande: ERROR-nivå", LoggerEnum.ERROR)
    logger.log("Testmeddelande: INFO-nivå", LoggerEnum.INFO)
    
    # Log to dynamoDB and send mail
    #logger.log("KRITISKT FEL: Systemkrasch", LoggerEnum.CRITICAL)

    send_critical_notification("Manuellt test av SNS")

    
if __name__ == "__main__":
    import uvicorn
    test_logging()
    uvicorn.run(app, host="0.0.0.0", port=8000)