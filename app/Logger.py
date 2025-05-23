from app.LoggerEnum import LoggerEnum
from app.MessageFormatter import MessageFormatter
from app.LoggerAPI import send_log
from app.service.SnsHandler import send_critical_notification

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

        if level == LoggerEnum.CRITICAL:
            send_critical_notification(item["message"])

        send_log(item)
