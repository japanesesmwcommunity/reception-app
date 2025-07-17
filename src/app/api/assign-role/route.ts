import {DiscordAPI} from "@/lib/discord";
import {NextRequest, NextResponse} from "next/server";

export const POST = async (request: NextRequest) => {
	try {
		const {userId, roles} = await request.json();

		if (!userId || !roles) {
			return NextResponse.json(
				{
					success: false,
					error: "ユーザーを選択してください。",
				},
				{status: 400},
			);
		}

		if (!process.env.DISCORD_ROLE_ID) {
			return NextResponse.json(
				{
					success: false,
					error: "システムエラーが発生しました。",
				},
				{status: 422},
			);
		}

		if (roles.includes(process.env.DISCORD_ROLE_ID)) {
			return NextResponse.json(
				{
					success: false,
					error: "すでに受付を済ませたメンバーです。",
				},
				{status: 403},
			);
		}

		await DiscordAPI.assignRoleToMember(userId, process.env.DISCORD_ROLE_ID);

		return NextResponse.json({
			success: true,
			message: "登録が完了しました。",
		});
	} catch (e) {
		console.log("Failed to assign role.", e);
		return NextResponse.json(
			{
				success: false,
				error: e instanceof Error ? e.message : "Unknown error",
			},
			{status: 500},
		);
	}
};
