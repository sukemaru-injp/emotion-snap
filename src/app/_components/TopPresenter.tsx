'use client';
import { theme } from '@/styles/theme';
import type { User } from '@supabase/supabase-js';
import { Button, Card, Col, Row, Space, Typography } from 'antd';
import Link from 'next/link';
import {
	FiAward,
	FiCamera,
	FiGlobe,
	FiSmartphone,
	FiTarget
} from 'react-icons/fi';
import { ThemeProvider } from './ThemeProvider';

const { Title, Paragraph } = Typography;

type Props = {
	user: User | null;
};

const features = [
	{
		icon: FiCamera,
		title: 'Photo Upload',
		description:
			'Upload face photos and detect emotions instantly with our advanced AI technology.'
	},
	{
		icon: FiTarget,
		title: 'Target Emotions',
		description:
			'Select a target emotion (joy, surprise, anger, etc.) and measure how well participants match it.'
	},
	{
		icon: FiAward,
		title: 'Ranking System',
		description:
			'Rank tables or individuals based on emotional scores for competitions or interactive events.'
	},
	{
		icon: FiSmartphone,
		title: 'Mobile-Friendly',
		description:
			'Enjoy a simple, intuitive user experience that works perfectly on all devices.'
	},
	{
		icon: FiGlobe,
		title: 'Multilingual',
		description:
			'Future support for multiple event types and multilingual environments.'
	}
];

export const TopPresenter: React.FC<Props> = ({ user }) => {
	return (
		<ThemeProvider>
			<section>
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
			</section>
			<div
				style={{
					width: '100%',
					padding: `${theme.spacing.xxl || '64px'} 0`,
					backgroundColor: theme.colors.background || '#f9fafb' // Equivalent to bg-muted/50
				}}
			>
				<div
					style={{
						maxWidth: '1280px', // container
						margin: '0 auto',
						padding: `0 ${theme.spacing.lg || '24px'}` // px-4 md:px-6
					}}
				>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							textAlign: 'center',
							marginBottom: theme.spacing.xl || '48px' // space-y-4 and py-12 before cards
						}}
					>
						<div style={{ marginBottom: theme.spacing.md }}>
							<Title
								level={2}
								style={{
									marginBottom: theme.spacing.sm
								}}
							>
								Key Features
							</Title>
							<Paragraph
								style={{
									maxWidth: '900px',
									color: theme.colors.textSecondary
								}}
							>
								Our application offers a comprehensive set of features to
								detect, analyze, and rank emotions.
							</Paragraph>
						</div>
					</div>
					<Row
						gutter={[
							{ xs: 16, sm: 24, md: 24 }, // Corresponds to gap-6 (24px)
							{ xs: 16, sm: 24, md: 24 }
						]}
						style={{
							maxWidth: '1024px', // max-w-5xl
							margin: '0 auto' // mx-auto for the grid
						}}
						justify="center"
					>
						{features.map((feature) => (
							<Col key={feature.title} xs={24} sm={12} lg={8}>
								<Card
									title={
										<Space
											align="center"
											size={
												theme.spacing.md
													? Number.parseInt(theme.spacing.md)
													: 16
											}
										>
											<feature.icon
												style={{
													fontSize: '28px',
													color: theme.colors.primary
												}}
											/>
											<Title
												level={5}
												style={{ margin: 0, fontSize: '1.25rem' }}
											>
												{feature.title}
											</Title>
										</Space>
									}
									style={{ height: '100%' }}
									styles={{
										header: {
											paddingBottom: theme.spacing.sm
										}
									}}
								>
									<Paragraph
										style={{
											fontSize: '0.875rem',
											color: theme.colors.textSecondary
										}}
									>
										{feature.description}
									</Paragraph>
								</Card>
							</Col>
						))}
					</Row>
				</div>
			</div>
		</ThemeProvider>
	);
};
