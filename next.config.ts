import type {NextConfig} from "next";

const nextConfig: NextConfig = {
	/* config options here */
    eslint: {
    ignoreDuringBuilds: true,  // ビルド時のESLintを無効化
  },
};

export default nextConfig;
