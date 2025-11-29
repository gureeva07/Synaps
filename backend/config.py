import os
from dotenv import load_dotenv
from chromadb.config import Settings

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
EMAIL_SERVER = os.getenv("EMAIL_SERVER")
EMAIL_USERNAME = os.getenv("EMAIL_USERNAME")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
EMAIL_PORT = os.getenv("EMAIL_PORT")

# IMAP configuration
IMAP_USERNAME = os.getenv("IMAP_USERNAME")  # defaults to EMAIL_USERNAME if not set
IMAP_PASSWORD = os.getenv("IMAP_PASSWORD")
IMAP_SERVER = os.getenv("IMAP_SERVER")
IMAP_PORT = os.getenv("IMAP_PORT")


# Проверка настроек chromadb
PERSIST_DIRECTORY = os.environ.get('PERSIST_DIRECTORY')
if PERSIST_DIRECTORY is None:
    raise Exception("Please set the PERSIST_DIRECTORY environment variable")
CHROMA_SETTINGS = Settings(
        persist_directory=PERSIST_DIRECTORY,
        anonymized_telemetry=False
)