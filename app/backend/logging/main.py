from app.backend.logging.Logger import Logger
from app.backend.logging.LoggerEnum import LoggerEnum
from app.backend.service.SnsHandler import send_critical_notification
from fastapi import FastAPI

# Initiera FastAPI
app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Loggify API is running!"}

def test_logging():
    # Skapa en logger-instans
    logger = Logger(level=LoggerEnum.DEBUG)
    
    # Testa INFO-nivå (ska endast loggas till databasen)
    logger.log("Testmeddelande: INFO-nivå", LoggerEnum.INFO)
    
    # Testa CRITICAL-nivå (ska loggas och skicka e-post)
    logger.log("KRITISKT FEL: Systemkrasch", LoggerEnum.CRITICAL)

    send_critical_notification("Manuellt test av SNS")

if __name__ == "__main__":
    import uvicorn
    # Kör tester först
    test_logging()
    # Starta sedan API:et
    uvicorn.run(app, host="0.0.0.0", port=8000)