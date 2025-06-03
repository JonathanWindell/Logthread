from app.backend.logging.LoggerEnum import LoggerEnum
from app.backend.logging.MessageFormatter import MessageFormatter
from app.backend.apifiles.LoggerAPI import send_log
from app.backend.service.SnsHandler import send_critical_notification

# Logger class with level-based filtering and critical alerts
class Logger:
    def __init__(self, level: LoggerEnum = LoggerEnum.INFO):
        self.level = level  # Minimum log level threshold
        self.formatter = MessageFormatter()

    def log(self, message: str, level: LoggerEnum = None):
        # Use instance level if no specific level provided
        if level is None:
            level = self.level

        # Skip logging if message level is below threshold
        if level.value < self.level.value:
            return

        # Format message into structured log item
        item = self.formatter.format(level, message)

        # Send critical alerts for CRITICAL level logs
        if level == LoggerEnum.CRITICAL: 
            send_critical_notification(item["message"])

        # Store log in database
        send_log(item)
