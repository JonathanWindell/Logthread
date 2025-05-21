from app.LoggerEnum import LoggerEnum
from app.MessageFormatter import MessageFormatter
from app.LoggerAPI import send_log

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
        send_log(item)
