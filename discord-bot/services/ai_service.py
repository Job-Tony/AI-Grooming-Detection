import aiohttp

from config import API_URL


class AIService:
    def __init__(self):
        self.predict_endpoint = f"{API_URL}/ai/predict"
        self.incident_endpoint = f"{API_URL}/incidents"

    async def predict(self, conversation: list[str]) -> dict:
        print("Calling AI backend...")
        print(self.predict_endpoint)

        payload = {
            "conversation": conversation
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(
                self.predict_endpoint,
                json=payload,
                timeout=aiohttp.ClientTimeout(total=30),
            ) as response:

                print("Prediction Status:", response.status)

                response.raise_for_status()

                data = await response.json()

                print(data)

                return data

    async def create_incident(
        self,
        *,
        guild_id: str | None,
        channel_id: str,
        channel_name: str | None,
        prediction: dict,
        conversation: list[str],
    ) -> dict:

        payload = {
            "platform": "discord",

            "guild_id": guild_id,

            "channel_id": channel_id,

            "channel_name": channel_name,

            "prediction": prediction["label"],

            "probability": prediction["probability"],

            "confidence": prediction["confidence"],

            "risk_score": prediction["risk_score"],

            "message_count": len(conversation),

            "conversation_excerpt": "\n".join(
                conversation[-10:]
            ),

            "model_version": prediction["model_version"],
        }

        print("Saving incident...")
        print(payload)

        async with aiohttp.ClientSession() as session:
            async with session.post(
                self.incident_endpoint,
                json=payload,
                timeout=aiohttp.ClientTimeout(total=30),
            ) as response:

                print("Incident Status:", response.status)

                response.raise_for_status()

                data = await response.json()

                print("Incident saved:", data)

                return data