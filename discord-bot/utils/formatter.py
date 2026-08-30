import discord


class PredictionFormatter:
    """Formats AI prediction results into Discord embeds."""

    @staticmethod
    def build_embed(result: dict) -> discord.Embed:

        risk_score = float(result.get("risk_score", 0))
        confidence = float(result.get("confidence", 0))
        probability = float(result.get("probability", 0))

        if risk_score >= 80:
            color = discord.Color.red()
            emoji = "🔴"
            level = "Critical"

        elif risk_score >= 50:
            color = discord.Color.orange()
            emoji = "🟠"
            level = "High"

        elif risk_score >= 20:
            color = discord.Color.gold()
            emoji = "🟡"
            level = "Medium"

        else:
            color = discord.Color.green()
            emoji = "🟢"
            level = "Low"

        embed = discord.Embed(
            title="🛡️ SafeChat AI Analysis Report",
            description="Conversation analysis completed successfully.",
            color=color,
        )

        embed.add_field(
            name="Prediction",
            value=result.get("label", "Unknown"),
            inline=True,
        )

        embed.add_field(
            name="Risk Level",
            value=f"{emoji} {level}",
            inline=True,
        )

        embed.add_field(
            name="Risk Score",
            value=f"{risk_score:.2f}",
            inline=True,
        )

        embed.add_field(
            name="Confidence",
            value=f"{confidence:.2f}%",
            inline=True,
        )

        embed.add_field(
            name="Probability",
            value=f"{probability:.2f}",
            inline=True,
        )

        embed.add_field(
            name="Messages Analysed",
            value=str(result.get("message_count", 0)),
            inline=True,
        )

        embed.add_field(
            name="Inference Time",
            value=f"{result.get('prediction_time_ms', 0):.2f} ms",
            inline=True,
        )

        embed.add_field(
            name="Model Version",
            value=result.get("model_version", "Unknown"),
            inline=True,
        )

        if "explanation" in result:

            explanation = result["explanation"]

            words = explanation.get("top_words", [])

            if words:
                embed.add_field(
                    name="Top Influential Words",
                    value=", ".join(words[:10]),
                    inline=False,
                )

        embed.set_footer(
            text="SafeChat AI • DistilBERT + BiLSTM"
        )

        return embed