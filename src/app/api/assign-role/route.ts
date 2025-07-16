import {DiscordAPI} from "@/lib/discord";
import {NextRequest, NextResponse} from "next/server";

export const POST = async (request: NextRequest) => {
	try {
		const {userId, roleId} = await request.json();

		if (!userId || !roleId) {
			return NextResponse.json(
				{
					success: false,
					error: "userId and roleId are required.",
				},
				{status: 400},
			);
		}

		await DiscordAPI.assignRoleToMember(userId, roleId);

		return NextResponse.json({
			success: true,
			message: "Role assigned successfully.",
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
