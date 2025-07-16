import {DiscordAPI} from "@/lib/discord";
import {DiscordMember, Member} from "@/types/discord";
import {NextResponse} from "next/server";

export const GET = async () => {
	try {
		const members: DiscordMember[] = await DiscordAPI.getGuildMembers();

		// botを除外
		const humanMembers = members.filter((member: DiscordMember) => !member.user.bot);

		// 必要なプロパティのみを抽出
		const processedMembers: Member[] = humanMembers.map((member) => ({
			id: member.user.id,
			username: member.user.username,
			displayName:
				member.nick || member.user.global_name || member.user.username,
			roles: member.roles,
		}));

		return NextResponse.json({
			success: true,
			members: processedMembers,
		});
	} catch (e) {
		console.error("Failed to fetch members in target server:", e);
		return NextResponse.json({
			success: false,
			error: e instanceof Error ? e.message : "Unknown error",
		});
	}
};
