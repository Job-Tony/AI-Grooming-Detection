import discord

from config import DISCORD_ALERT_CHANNEL_ID


class ModeratorAlertService:

    def __init__(self, bot):
        self.bot = bot

    async def send_alert(
        self,
        source_channel: discord.TextChannel,
        embed: discord.Embed,
    ):

        alert_channel = self.bot.get_channel(
            DISCORD_ALERT_CHANNEL_ID
        )

        if alert_channel is None:
            print("Alert channel not found.")
            return

        await alert_channel.send(
            f"🚨 **SafeChat AI Alert**\n"
            f"Source Channel: {source_channel.mention}",
            embed=embed,
        )