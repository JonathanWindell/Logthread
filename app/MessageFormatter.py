from app.LoggerEnum import LoggerEnum
import datetime
import uuid

class MessageFormatter:

    @staticmethod
    def format(log_level: LoggerEnum, message: str) -> dict:
        return {
            "log_id": str(uuid.uuid4()),
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "level": log_level.name,
            "message": message
        }