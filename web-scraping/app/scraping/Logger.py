import logging
import os
from urllib.parse import urlparse

class Logger:
    LOG_DIR: str = "logs"

    def __init__(self, url: str):
        parseUrl = urlparse(url)
        logFile = f"{parseUrl.netloc.replace('/', '_')}.log"
        logPath = os.path.join(self.LOG_DIR, logFile)

        if not os.path.exists(self.LOG_DIR):
            os.makedirs(self.LOG_DIR)

        self.logger = logging.getLogger(url)
        self.logger.setLevel(logging.INFO)

        fileHandler = logging.FileHandler(logPath)
        fileHandler.setLevel(logging.INFO)
        fileHandler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))

        self.logger.addHandler(fileHandler)

        streamHandler = logging.StreamHandler()
        streamHandler.setLevel(logging.INFO)
        streamHandler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
        self.logger.addHandler(streamHandler)

    def info(self, message: str):
        self.logger.info(message)

    def warning(self, message: str):
        self.logger.warning(message)

    def error(self, message: str):
        self.logger.error(message)

    def close(self):
        for handler in self.logger.handlers:
            handler.close()
            self.logger.removeHandler(handler)
