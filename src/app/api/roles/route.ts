import {DiscordAPI} from "@/lib/discord";
import {DiscordRole, Role} from "@/types/discord";
import {NextResponse} from "next/server";

export const GET = async () => {
	try {
		const roles: DiscordRole[] = await DiscordAPI.getGuildRoles();

		const processedRoles: Role[] = roles.map((role) => ({
			id: role.id,
			name: role.name,
			color: role.color,
			position: role.position,
		}));

		return NextResponse.json({
			success: true,
			roles: processedRoles,
		});
	} catch (e) {
		console.error("Failed to fetch members in target server:", e);
		return NextResponse.json({
			success: false,
			error: e instanceof Error ? e.message : "Unknown error",
		});
	}
};
