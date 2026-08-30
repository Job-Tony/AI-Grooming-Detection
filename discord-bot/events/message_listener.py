import asyncio
import time

from discord import Message
from discord.ext import commands

from config import RISK_THRESHOLD
from services.ai_service import AIService
from services.conversation_buffer import ConversationBuffer
from services.moderator_alert import ModeratorAlertService
from utils.formatter import PredictionFormatter


class MessageListener(commands.Cog):
    """
    Automatically monitors Discord conversations and sends them
    to the SafeChat AI backend for analysis.
    """

    HISTORY_LIMIT = 20
    MIN_MESSAGES = 5
    ANALYZE_EVERY = 10
    ALERT_COOLDOWN = 300

    def __init__(self, bot: commands.Bot):
        self.bot = bot

        self.ai = AIService()
        self.buffer = ConversationBuffer(self.HISTORY_LIMIT)
        self.alert_service = ModeratorAlertService(bot)

        self.message_counter: dict[int, int] = {}
        self.last_alert: dict[int, float] = {}

        # One lock per channel
        self.channel_locks: dict[int, asyncio.Lock] = {}

    @commands.Cog.listener()
    async def on_message(self, message: Message):

        # Ignore bots
        if message.author.bot:
            return

        # Store message in rolling buffer
        self.buffer.add_message(message)

        # Allow commands
        await self.bot.process_commands(message)

        ctx = await self.bot.get_context(message)

        if ctx.valid:
            return

        channel_id = message.channel.id

        count = self.message_counter.get(channel_id, 0) + 1
        self.message_counter[channel_id] = count

        if count < self.ANALYZE_EVERY:
            return

        self.message_counter[channel_id] = 0

        asyncio.create_task(
            self.analyze_channel(message)
        )

    async def analyze_channel(self, message: Message):

        channel_id = message.channel.id

        lock = self.channel_locks.setdefault(
            channel_id,
            asyncio.Lock(),
        )

        async with lock:

            conversation = self.buffer.get_conversation(
                channel_id
            )

            if len(conversation) < self.MIN_MESSAGES:
                return

            # --------------------------------------------------
            # AI Prediction
            # --------------------------------------------------

            try:
                result = await self.ai.predict(
                    conversation
                )

            except Exception as e:
                print(f"[AI ERROR] {e}")
                return

            print(
                f"[AI RESULT] "
                f"label={result.get('label')} "
                f"risk={result.get('risk_score')}"
            )

            risk_score = float(
                result.get("risk_score", 0.0)
            )

            # --------------------------------------------------
            # Risk Threshold
            # --------------------------------------------------

            if risk_score < RISK_THRESHOLD:
                return

            # --------------------------------------------------
            # Alert Cooldown
            # --------------------------------------------------

            now = time.time()

            if (
                now - self.last_alert.get(channel_id, 0)
                < self.ALERT_COOLDOWN
            ):
                print(
                    "[ALERT] Skipped because channel "
                    "is still on cooldown."
                )
                return

            self.last_alert[channel_id] = now

            # --------------------------------------------------
            # Save Incident to Backend
            # --------------------------------------------------

            guild_id = (
                str(message.guild.id)
                if message.guild is not None
                else None
            )

            channel_name = getattr(
                message.channel,
                "name",
                None,
            )

            try:
                incident = await self.ai.create_incident(
                    guild_id=guild_id,
                    channel_id=str(channel_id),
                    channel_name=channel_name,
                    prediction=result,
                    conversation=conversation,
                )

                print(
                    f"✅ Incident saved: "
                    f"{incident.get('id')}"
                )

            except Exception as e:
                print(
                    f"[INCIDENT ERROR] {e}"
                )

            # --------------------------------------------------
            # Send Moderator Alert
            # --------------------------------------------------

            embed = PredictionFormatter.build_embed(
                result
            )

            await self.alert_service.send_alert(
                source_channel=message.channel,
                embed=embed,
            )


async def setup(bot: commands.Bot):
    await bot.add_cog(MessageListener(bot))