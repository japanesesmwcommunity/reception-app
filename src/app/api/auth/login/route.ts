import {NextRequest, NextResponse} from "next/server";

export const POST = async (request: NextRequest) => {
	try {
		const {username, password} = await request.json();

		if (
			username === process.env.ADMIN_USERNAME &&
			password === process.env.ADMIN_PASSWORD
		) {
			return NextResponse.json({
				success: true,
				message: "Login successful.",
			});
		} else {
			return NextResponse.json(
				{
					success: false,
					message: "Invalid credentials",
				},
				{status: 401},
			);
		}
	} catch (e) {
		console.error("Login error", e);
		return NextResponse.json(
			{
				success: false,
				error: "Login failed.",
			},
			{status: 500},
		);
	}
};
