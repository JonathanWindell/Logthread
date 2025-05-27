from app.backend.logging.LoggerEnum import LoggerEnum
from app.backend.logging.MessageFormatter import MessageFormatter
from app.backend.logging.LoggerAPI import send_log
from app.backend.service.SnsHandler import send_critical_notification

class Logger:
    def __init__(self, level: LoggerEnum = LoggerEnum.INFO):
        self.level = level
        self.formatter = MessageFormatter()

    def log(self, message: str, level: LoggerEnum = None):
        if level is None:
            level = self.level

        if level.value < self.level.value:
            return

        item = self.formatter.format(level, message)

        if level == LoggerEnum.CRITICAL: #Let user decide instead. Through frontend
            send_critical_notification(item["message"])

        send_log(item)
