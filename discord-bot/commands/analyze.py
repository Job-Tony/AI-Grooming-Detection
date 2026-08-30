from discord.ext import commands

from services.ai_service import AIService
from utils.formatter import PredictionFormatter


class Analyze(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot
        self.ai = AIService()

    @commands.command(name="analyze")
    async def analyze(self, ctx: commands.Context):
        try:
            await ctx.send("🔍 Collecting recent conversation...")

            messages = []

            async for message in ctx.channel.history(limit=20):
                if message.author.bot:
                    continue

                messages.append(message.content)

            messages.reverse()

            if not messages:
                await ctx.send("No messages found.")
                return

            print("Calling backend...")

            result = await self.ai.predict(messages)

            print("Backend returned:", result)

            print("Building embed...")

            embed = PredictionFormatter.build_embed(result)

            print("Sending embed...")

            await ctx.send(embed=embed)

            print("Done.")

        except Exception as e:
            import traceback

            traceback.print_exc()
            await ctx.send(f"❌ Error: `{e}`")


async def setup(bot):
    await bot.add_cog(Analyze(bot))