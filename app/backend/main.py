from app.backend.logging.Logger import Logger
from app.backend.logging.LoggerEnum import LoggerEnum
from app.backend.service.SnsHandler import send_critical_notification
from app.backend.apifiles.Routers import router as logs_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from mangum import Mangum  

app = FastAPI()

app.include_router(logs_router, prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],   
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Loggify API is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

handler = Mangum(app)