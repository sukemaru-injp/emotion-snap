import '../styles/globals.css';
import { theme } from '@/styles/theme';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata } from 'next';
import { Noto_Sans_JP, Poppins } from 'next/font/google';
import Link from 'next/link';

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
	]
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
							backgroundColor: theme.colors.primary,
							display: 'grid',
							placeContent: 'center',
							padding: `${theme.spacing.sm}`,
							zIndex: 1000
						}}
					>
						<Link href="/" style={{ textDecoration: 'none' }}>
							<h2
								style={{
									color: 'white',
									fontWeight: 'bold'
								}}
							>
								余興
							</h2>
						</Link>
					</header>
					<main style={{ minHeight: '100vh' }}>{children}</main>
					<footer
						style={{
							textAlign: 'center',
							backgroundColor: theme.colors.background,
							color: theme.colors.textSecondary,
							padding: `${theme.spacing.md} 0`
						}}
					>
						©2025 sukemaru
					</footer>
				</AntdRegistry>
			</body>
		</html>
	);
}
