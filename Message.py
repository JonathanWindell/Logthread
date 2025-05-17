import datetime
from LoggerEnum import LoggerEnum

class MessageFormatter:
    @staticmethod
    def format(log_level: LoggerEnum, message: str) -> str:
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        return f"[{timestamp}] [{log_level.name}] {message}"