import logging


#Will you use this?
"""
class LoggerEnum(Enum):
    DEBUG = 0
    INFO = 1
    WARNING = 2
    ERROR = 3
    CRITICAL = 4
"""

#Let user decide logging level
message = ("Log level is at: " (level))

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


