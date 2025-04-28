import '../styles/globals.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata } from 'next';
import { Noto_Sans_JP, Poppins } from 'next/font/google';

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
			<AntdRegistry>
				<body className={`${poppins.className} ${notoSansJP.className}`}>
					<header>header</header>
					<main>{children}</main>
				</body>
			</AntdRegistry>
		</html>
	);
}
