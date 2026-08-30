from dotenv import load_dotenv
import os

load_dotenv()

DISCORD_TOKEN = os.getenv("DISCORD_TOKEN")
API_URL = os.getenv("API_URL")
RISK_THRESHOLD = float(os.getenv("RISK_THRESHOLD", "0.80"))

if not DISCORD_TOKEN:
    raise ValueError("DISCORD_TOKEN is missing in the .env file.")

DISCORD_ALERT_CHANNEL_ID = int(
    os.getenv("DISCORD_ALERT_CHANNEL_ID", "0")
)