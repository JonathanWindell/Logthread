import datetime
from LoggerEnum import LoggerEnum

class DateTimeMessage(self):
    def __init__(self):
        "A log has been added at: " + datetime.now() + LoggerEnum.INFO