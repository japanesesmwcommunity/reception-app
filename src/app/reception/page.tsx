"use client";

import {Member, Role} from "@/types/discord";
import {
	Alert,
	Box,
	Button,
	Checkbox,
	Chip,
	Container,
	FormControl,
	FormControlLabel,
	InputLabel,
	MenuItem,
	Paper,
	Radio,
	RadioGroup,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import {useEffect, useState} from "react";

type ParticipantType = "discord" | "general";

const ReceptionPage = () => {
	const [participantType, setParticipantType] =
		useState<ParticipantType>("discord");
	const [selectedMember, setSelectedMember] = useState("");
	const [memberRoles, setMemberRoles] = useState<string[]>([]);
	const [selectedRole, setSelectedRole] = useState("");
	const [username, setUsername] = useState("");
	const [contact, setContact] = useState("");
	const [paymentReceived, setPaymentReceived] = useState(false);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	const [members, setMembers] = useState<Member[]>([]);
	const [roles, setRoles] = useState<Role[]>([]);

	// データ取得
	useEffect(() => {
		const fetchData = async () => {
			try {
				const [membersRes, rolesRes] = await Promise.all([
					fetch("/api/members"),
					fetch("/api/roles"),
				]);

				const membersData = await membersRes.json();
				const rolesData = await rolesRes.json();

				if (membersData.success || rolesData.success) {
					setMembers(membersData.members);
					setRoles(rolesData.roles);
				} else {
					setMessage("Discordサーバー情報の取得に失敗しました。");
				}
			} catch (error) {
				console.error("Failed to fetch data:", error);
			}
		};

		fetchData();
	}, []);

	// メンバー選択時の処理
	const handleMemberChange = (memberId: string) => {
		setSelectedMember(memberId);
		const member = members.find((m) => m.id === memberId);
		if (member) {
			setMemberRoles(member.roles);
		}
	};

	// 登録処理
	const handleRegister = async () => {
		setLoading(true);
		setMessage("");

		try {
			if (participantType === "discord") {
				// Discord参加者の場合：ロール付与
				const response = await fetch("/api/assign-role", {
					method: "POST",
					headers: {"Content-Type": "application/json"},
					body: JSON.stringify({
						userId: selectedMember,
						roleId: selectedRole,
					}),
				});

				const data = await response.json();
				if (data.success) {
					setMembers((prev) =>
						prev.map((member) =>
							member.id === selectedMember
								? {...member, roles: [...member.roles, selectedRole]}
								: member,
						),
					);
					setMessage("登録が完了しました！");
					// フォームリセット
					setSelectedMember("");
					setSelectedRole("");
				} else {
					setMessage("登録に失敗しました: " + data.error);
				}
			} else {
				// 一般参加者の場合：Google Sheets記録（後で実装）
				setMessage("一般参加者として登録しました（記録機能は後で実装）");
				// フォームリセット
				setUsername("");
				setContact("");
			}

			setPaymentReceived(false);
		} catch (error) {
			setMessage(`登録中にエラーが発生しました: ${error}`);
		} finally {
			setLoading(false);
		}
	};

	// 利用可能なロール（現在のロールを除外）
	const availableRoles = roles.filter((role) => !memberRoles.includes(role.id));

	// 登録ボタンの有効性
	const isFormValid =
		paymentReceived &&
		(participantType === "discord"
			? selectedMember && selectedRole
			: username && contact);

	return (
		<Container maxWidth='md'>
			<Box sx={{mt: 4}}>
				<Paper elevation={3} sx={{p: 4}}>
					<Typography variant='h4' component='h1' gutterBottom align='center'>
						受付くん
					</Typography>
					<Typography
						variant='h6'
						component='h2'
						gutterBottom
						align='center'
						color='text.secondary'
					>
						参加者受付
					</Typography>

					{message && (
						<Alert
							severity={message.includes("完了") ? "success" : "error"}
							sx={{mb: 3}}
						>
							{message}
						</Alert>
					)}

					{/* 参加者タイプ選択 */}
					<FormControl sx={{mb: 3}}>
						<Typography variant='subtitle1' gutterBottom>
							参加者タイプ
						</Typography>
						<RadioGroup
							value={participantType}
							onChange={(e) =>
								setParticipantType(e.target.value as ParticipantType)
							}
						>
							<FormControlLabel
								value='discord'
								control={<Radio />}
								label='Discordサーバー参加済み'
							/>
							<FormControlLabel
								value='general'
								control={<Radio />}
								label='Discordサーバー未参加'
							/>
						</RadioGroup>
					</FormControl>

					{/* Discordメンバーフォーム */}
					{participantType === "discord" && (
						<Box sx={{mb: 3}}>
							<FormControl fullWidth sx={{mb: 2}}>
								<InputLabel>メンバー選択</InputLabel>
								<Select
									value={selectedMember}
									onChange={(e) => handleMemberChange(e.target.value)}
									label='メンバー選択'
								>
									{members.map((member) => (
										<MenuItem key={member.id} value={member.id}>
											{member.displayName} (@{member.username})
										</MenuItem>
									))}
								</Select>
							</FormControl>

							{/* 現在のロール表示 */}
							{memberRoles.length > 0 && (
								<Box sx={{mb: 2}}>
									<Typography variant='subtitle2' gutterBottom>
										現在のロール:
									</Typography>
									<Box sx={{display: "flex", gap: 1, flexWrap: "wrap"}}>
										{memberRoles.map((roleId) => {
											const role = roles.find((r) => r.id === roleId);
											return role ? (
												<Chip key={roleId} label={role.name} size='small' />
											) : null;
										})}
									</Box>
								</Box>
							)}

							{/* ロール選択 */}
							<FormControl fullWidth sx={{mb: 2}}>
								<InputLabel>付与するロール</InputLabel>
								<Select
									value={selectedRole}
									onChange={(e) => setSelectedRole(e.target.value)}
									label='付与するロール'
									disabled={!selectedMember}
								>
									{availableRoles.map((role) => (
										<MenuItem key={role.id} value={role.id}>
											{role.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Box>
					)}

					{/* 一般参加者フォーム */}
					{participantType === "general" && (
						<Box sx={{mb: 3}}>
							<TextField
								fullWidth
								label='ユーザー名'
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								sx={{mb: 2}}
								required
							/>
							<TextField
								fullWidth
								label='連絡先（SNS等）'
								value={contact}
								onChange={(e) => setContact(e.target.value)}
								sx={{mb: 2}}
								required
							/>
						</Box>
					)}

					{/* 参加費確認 */}
					<FormControlLabel
						control={
							<Checkbox
								checked={paymentReceived}
								onChange={(e) => setPaymentReceived(e.target.checked)}
							/>
						}
						label='参加費を受領しました'
						sx={{mb: 3}}
					/>

					{/* 登録ボタン */}
					<Button
						fullWidth
						variant='contained'
						size='large'
						onClick={handleRegister}
						disabled={!isFormValid || loading}
					>
						{loading ? "登録中..." : "登録"}
					</Button>
				</Paper>
			</Box>
		</Container>
	);
};

export default ReceptionPage;
