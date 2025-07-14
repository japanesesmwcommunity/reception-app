"use client";

import CssBaseline from "@mui/material/CssBaseline";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {Inter} from "next/font/google";
import "./globals.css";

const inter = Inter({subsets: ["latin"]});

const theme = createTheme({
	// 必要に応じてテーマをカスタマイズ
});

// メタデータは別ファイルに移動するか、削除
// export const metadata: Metadata = {
//   title: 'Reception App',
//   description: 'Event reception management system',
// }

function RootLayoutContent({children}: {children: React.ReactNode}) {
	return (
		<html lang='ja'>
			<body className={inter.className}>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}

export default RootLayoutContent;
