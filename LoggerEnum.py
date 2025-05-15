import logging
import datetime
from enum import Enum

class LoggerEnum(Enum):
    DEBUG = 0
    INFO = 1
    WARNING = 2
    ERROR = 3
    CRITICAL = 4

class DateTimeMessage(self):
    def __init__(self):
        datetime.now() + ""

class CustomLogger:
    def __init__(self, level: LoggerEnum):
        self.level = level
        logging.basicConfig(level=self.convert_enum_to_logging_level())
        self.logger = logging.getLogger("Logger")

    def _convert_enum_to_logging_level(self):
        level_map = {
            LoggerEnum.DEBUG: logging.DEBUG,
            LoggerEnum.INFO: logging.INFO,
            LoggerEnum.WARNING: logging.WARNING,
            LoggerEnum.ERROR: logging.ERROR,
            LoggerEnum.CRITICAL: logging.CRITICAL,
        }
        return level_map[self.level]

class Logging:
    @staticmethod
    def log_message(message, level):
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


