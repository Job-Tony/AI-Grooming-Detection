from discord.ext import commands


class Help(commands.Cog):

    def __init__(self, bot):
        self.bot = bot

    @commands.command(name="help")
    async def help(self, ctx):

        await ctx.send(
            """
**🛡️ SafeChat AI Commands**

`!ping`
Check if the bot is online.

`!analyze`
Analyze the latest conversation.

Automatic monitoring is also enabled.
"""
        )


async def setup(bot):
    await bot.add_cog(Help(bot))