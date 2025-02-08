from mongoengine import connect, disconnect as disconnectMongo
from dotenv import load_dotenv
from os import getenv

class Database:

    @staticmethod
    def connect():
        load_dotenv()
        connect(getenv("DB_NAME"), host=getenv("DB_HOST"), port=int(getenv("DB_PORT")))

    @staticmethod
    def disconnect():
        disconnectMongo()
