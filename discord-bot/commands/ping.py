from discord.ext import commands


class Ping(commands.Cog):
    """Basic health check command."""

    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @commands.command(name="ping")
    async def ping(self, ctx: commands.Context):
        """Check whether the bot is online."""
        latency = round(self.bot.latency * 1000)

        await ctx.send(
            f"🏓 **SafeChat AI is Online!**\n"
            f"Latency: `{latency} ms`"
        )


async def setup(bot: commands.Bot):
    await bot.add_cog(Ping(bot))