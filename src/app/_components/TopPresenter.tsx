'use client';
import { theme } from '@/styles/theme';
import type { User } from '@supabase/supabase-js';
import { Button, Typography } from 'antd';
import Link from 'next/link';
import { ThemeProvider } from './ThemeProvider';

const { Title, Paragraph } = Typography;

type Props = {
	user: User | null;
};

export const TopPresenter: React.FC<Props> = ({ user }) => {
	return (
		<ThemeProvider>
			<div style={{ padding: theme.spacing.xl }}>
				<Title
					level={2}
					style={{
						color: theme.colors.textPrimary,
						marginBottom: theme.spacing.md
					}}
				>
					emotion-snap
				</Title>
				<Paragraph
					style={{
						color: theme.colors.textPrimary,
						marginBottom: theme.spacing.lg
					}}
				>
					感情を捉え、結婚式、パーティー、イベントなどでエキサイティングなランキングを作成します。
				</Paragraph>
				{user ? (
					<Link href="/mypage">
						<Button type="link">マイページへ</Button>
					</Link>
				) : (
					<Link href="/login">
						<Button type="link">ログイン</Button>
					</Link>
				)}
			</div>
		</ThemeProvider>
	);
};
