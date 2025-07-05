import '../styles/globals.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata } from 'next';
import { Noto_Sans_JP, Poppins } from 'next/font/google';
import Link from 'next/link';
import { theme } from '@/styles/theme';
import { ThemeProvider } from './_components/ThemeProvider';
import '@ant-design/v5-patch-for-react-19';

const poppins = Poppins({
	weight: ['400', '600', '700'],
	subsets: ['latin'],
	display: 'swap'
});

const notoSansJP = Noto_Sans_JP({
	weight: ['400', '700'],
	subsets: ['latin'],
	display: 'swap'
});

export const metadata: Metadata = {
	title: 'emotion-snap',
	description:
		'顔写真から感情を解析してスコア化するイベント用Webアプリ。笑顔、驚き、怒りなど、さまざまな感情を数値化してランキング',
	keywords: [
		'emotion snap',
		'感情分析',
		'顔解析',
		'表情スコア',
		'ランキングアプリ',
		'結婚式余興',
		'パーティーツール'
	],
	icons: {
		icon: '/favicon.ico',
		shortcut: '/favicon.ico'
	}
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<body className={`${poppins.className} ${notoSansJP.className}`}>
				<AntdRegistry>
					<header
						style={{
							position: 'sticky',
							top: 0,
							backgroundColor: 'white',
							display: 'grid',
							placeContent: 'center',
							padding: `${theme.spacing.sm}`,
							zIndex: 1000,
							boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
						}}
					>
						<Link href="/" style={{ textDecoration: 'none' }}>
							<h2
								style={{
									color: theme.colors.primary,
									fontWeight: 'bold'
								}}
							>
								余興
							</h2>
						</Link>
					</header>
					<main style={{ minHeight: '100vh' }}>
						<ThemeProvider>{children}</ThemeProvider>
					</main>
					<footer
						style={{
							textAlign: 'center',
							backgroundColor: theme.colors.background,
							color: theme.colors.textSecondary,
							padding: `${theme.spacing.md} 0`
						}}
					>
						<div style={{ marginBottom: theme.spacing.sm }}>
							<Link
								href=""
								target="_blank"
								rel="noopener noreferrer"
								style={{
									color: theme.colors.textSecondary,
									textDecoration: 'underline'
								}}
							>
								使い方
							</Link>
						</div>
						©2025 sukemaru
					</footer>
				</AntdRegistry>
			</body>
		</html>
	);
}
