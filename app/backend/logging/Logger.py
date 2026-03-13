from app.backend.logging.LoggerEnum import LoggerEnum
from app.backend.logging.MessageFormatter import MessageFormatter
from app.backend.apifiles.LoggerAPI import send_log
from app.backend.service.SnsHandler import send_critical_notification

class Logger:
    """
    A core logging utility that handles level-based filtering, message formatting, 
    and multi-channel distribution (Database and SNS).

    This class ensures that only logs meeting a specific severity threshold are 
    processed, providing an efficient way to manage application telemetry.
    """

    def __init__(self, level: LoggerEnum = LoggerEnum.INFO):
        """
        Initializes the Logger with a specific severity threshold and formatter.

        Args:
            level (LoggerEnum): The minimum LoggerEnum level required for a 
                message to be processed. Defaults to LoggerEnum.INFO.

        Returns:
            None
        """
        self.level = level  # Minimum log level threshold
        self.formatter = MessageFormatter()

    def log(self, message: str, level: LoggerEnum = None):
        """
        Processes a log message based on its severity level.

        The method performs the following steps:
        1. Validates the level against the instance threshold.
        2. Formats the message into a structured dictionary.
        3. Triggers an SNS notification if the level is CRITICAL.
        4. Persists the log entry to the primary data store.

        Args:
            message (str): The raw text or data to be logged.
            level (LoggerEnum, optional): The severity of this specific log. 
                If None, the instance's default level is used.

        Returns:
            None

        Raises:
            Exception: If formatting or downstream service calls (SNS/Database) fail.
        """
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