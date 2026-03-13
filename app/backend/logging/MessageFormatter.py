from app.backend.logging.LoggerEnum import LoggerEnum
import datetime
import uuid

class MessageFormatter:
    """
    Standardizes the structure of log records across the application.

    This class ensures that every log entry, regardless of source, contains 
    the necessary metadata for tracking, auditing, and storage in DynamoDB or S3.
    """

    @staticmethod
    def format(log_level: LoggerEnum, message: str) -> dict:
        """
        Transforms raw log data into a structured dictionary.

        Args:
            log_level (LoggerEnum): The severity level of the log, 
                used to extract the string name (e.g., 'INFO').
            message (str): The primary descriptive text for the log entry.

        Returns:
            dict: A structured log item containing:
                - log_id (str): A unique UUID v4 string.
                - timestamp (str): The current UTC time in ISO 8601 format.
                - level (str): The uppercase name of the log level.
                - message (str): The original message text.
        """
        return {
            "log_id": str(uuid.uuid4()),
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "level": log_level.name,
            "message": message
        }