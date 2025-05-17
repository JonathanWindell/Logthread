from Logger import Logger
from LoggerEnum import LoggerEnum

logger = Logger(level=LoggerEnum.DEBUG)

logger.log("Test message", LoggerEnum.INFO)