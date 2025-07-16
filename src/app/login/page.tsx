"use client";

import {
	Alert,
	Box,
	Button,
	Container,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import {useRouter} from "next/navigation";
import {useState} from "react";

export default function LoginPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({username, password}),
			});

			const data = await response.json();

			if (data.success) {
				// 認証成功 - メイン画面へ遷移
				router.push("/reception");
			} else {
				setError("ユーザー名またはパスワードが間違っています");
			}
		} catch (error) {
			setError("ログインに失敗しました");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container maxWidth='sm'>
			<Box sx={{mt: 8}}>
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
						管理者ログイン
					</Typography>

					{error && (
						<Alert severity='error' sx={{mb: 2}}>
							{error}
						</Alert>
					)}

					<Box component='form' onSubmit={handleLogin} sx={{mt: 2}}>
						<TextField
							fullWidth
							label='ユーザー名'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							margin='normal'
							required
						/>
						<TextField
							fullWidth
							label='パスワード'
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							margin='normal'
							required
						/>
						<Button
							type='submit'
							fullWidth
							variant='contained'
							sx={{mt: 3, mb: 2}}
							disabled={loading}
						>
							{loading ? "ログイン中..." : "ログイン"}
						</Button>
					</Box>
				</Paper>
			</Box>
		</Container>
	);
}
