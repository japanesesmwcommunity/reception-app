import {NextResponse} from "next/server";

export const GET = async () => {
	try {
		const response = await fetch(
			`https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}`,
			{
				headers: {
					Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
					"Content-Type": "application/json",
				},
			},
		);

		if (!response.ok) {
			throw new Error(`Discord APIエラー: ${response.status}`);
		}

		const guildData = await response.json();

		return NextResponse.json({
			success: true,
			guildName: guildData.name,
			memberCount: guildData.approximate_member_count,
		});
	} catch (e) {
		console.error("Discord API test failed:", e);
		return NextResponse.json({
			success: false,
			error: e instanceof Error ? e.message : "Unknown error",
		});
	}
};
