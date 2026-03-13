import logging
import datetime
from enum import Enum

class LoggerEnum(Enum):
    """
    Defines the hierarchy of log severity levels.

    Each member is associated with an integer value to allow for 
    threshold comparisons (e.g., only logging levels >= INFO).
    """
    DEBUG = 0
    INFO = 1
    WARNING = 2
    ERROR = 3
    CRITICAL = 4

class DateTimeMessage:
    """
    A utility class for managing and formatting timestamps within log messages.
    """
    def __init__(self):
        """
        Initializes the DateTimeMessage instance.

        Returns:
            None
        """
        # Fixed logic: Storing the current time as a string ISO format
        self.current_time = datetime.datetime.now().isoformat()

class CustomLogger:
    """
    A wrapper around the standard Python logging module to bridge 
    CustomLoggerEnums with system-level logging.
    """
    def __init__(self, level: LoggerEnum):
        """
        Configures the system logger based on the provided custom Enum level.

        Args:
            level (LoggerEnum): The threshold level for the logger instance.

        Returns:
            None
        """
        self.level = level
        logging.basicConfig(level=self._convert_enum_to_logging_level())
        self.logger = logging.getLogger("Logger")

    def _convert_enum_to_logging_level(self):
        """
        Maps internal LoggerEnum members to standard Python logging constants.

        Returns:
            int: The corresponding logging constant (e.g., logging.DEBUG).
        """
        level_map = {
            LoggerEnum.DEBUG: logging.DEBUG,
            LoggerEnum.INFO: logging.INFO,
            LoggerEnum.WARNING: logging.WARNING,
            LoggerEnum.ERROR: logging.ERROR,
            LoggerEnum.CRITICAL: logging.CRITICAL,
        }
        return level_map[self.level]

class Logging:
    """
    A static utility class providing a simplified interface for 
    string-based log routing.
    """
    @staticmethod
    def log_message(message: str, level: str):
        """
        Routes a message to the standard logging module based on a string input.

        Args:
            message (str): The content to be logged.
            level (str): The string representation of the level ('Debug', 'Info', etc.).

        Returns:
            None
        """
        # Route messages to appropriate logging method based on string level
        if level == "Debug":
            logging.debug(message)
        elif level == "Info":
            logging.info(message)
        elif level == "Warning":
            logging.warning(message)
        elif level == "Error":
            logging.error(message)
        elif level == "Critical":
            logging.critical(message)