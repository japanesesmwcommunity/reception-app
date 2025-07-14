import {DiscordMember, DiscordRole} from "@/types/discord";
import {HttpMethod} from "@/types/http";

export class DiscordAPI {
	private static async request(
		endpoint: string,
		method: HttpMethod = HttpMethod.GET,
	): Promise<any> {
		const response = await fetch(`https://discord.com/api/v10${endpoint}`, {
			headers: {
				Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`Discord API error: ${response.status}`);
		}
		return response.json();
	}

	static async getGuildMembers(): Promise<DiscordMember[]> {
		return this.request(
			`/guilds/${process.env.DISCORD_GUILD_ID}/members?limit=1000`,
		);
	}

	static async getGuildRoles(): Promise<DiscordRole[]> {
		return this.request(`/guilds/${process.env.DISCORD_GUILD_ID}/roles`);
	}

	static async assignRoleToMember(
		userId: string,
		roleId: string,
	): Promise<void> {
		await this.request(
			`/guilds/${process.env.DISCORD_GUILD_ID}/members/${userId}/roles/${roleId}`,
			HttpMethod.PUT,
		);
	}
}
