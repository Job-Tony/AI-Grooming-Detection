import asyncio

import discord
from discord.ext import commands

from config import DISCORD_TOKEN

intents = discord.Intents.default()
intents.guilds = True
intents.messages = True
intents.message_content = True

bot = commands.Bot(
    command_prefix="!",
    intents=intents,
    help_command=None,
)


@bot.event
async def on_ready():
    print("=" * 50)
    print(f"Logged in as : {bot.user}")
    print(f"Bot ID       : {bot.user.id}")
    print(f"Guilds       : {len(bot.guilds)}")
    print("=" * 50)


async def load_extensions():
    extensions = [
        "commands.ping",
        "commands.analyze",
        "commands.help",
        "events.message_listener",
    ]

    for extension in extensions:
        try:
            await bot.load_extension(extension)
            print(f"✅ Loaded: {extension}")
        except Exception as e:
            print(f"❌ Failed to load {extension}")
            raise e


async def main():
    async with bot:
        await load_extensions()
        await bot.start(DISCORD_TOKEN)


if __name__ == "__main__":
    asyncio.run(main())