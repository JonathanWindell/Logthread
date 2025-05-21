import datetime
import uuid
from app.LoggerEnum import LoggerEnum
from app.sns.SnsHandler import send_critical_notification


class MessageFormatter:

    @staticmethod
    def logMessage(log_level: LoggerEnum, message: str):
        formatted_message = MessageFormatter.format(log_level, message)
        if log_level == LoggerEnum.CRITICAL:
            send_critical_notification(formatted_message["message"])

    @staticmethod
    def format(log_level: LoggerEnum, message: str) -> dict:
        return {
            "log_id": str(uuid.uuid4()),
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "level": log_level.name,
            "message": message
        }
