'use client';
import { theme } from '@/styles/theme';
import type { User } from '@supabase/supabase-js';
import { Button, Card, Col, Image, Row, Space, Typography } from 'antd';
import Link from 'next/link';
import {
	FiArrowRight,
	FiAward,
	FiCamera,
	FiGlobe,
	FiSmartphone,
	FiTarget
} from 'react-icons/fi';

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
		<>
			<section
				style={{
					width: '100%',
					backgroundColor: '#F2ECE5',
					paddingTop: theme.spacing.xxl,
					paddingBottom: theme.spacing.xxl
				}}
			>
				<div
					style={{
						maxWidth: '1280px',
						margin: '0 auto',
						paddingLeft: theme.spacing.lg,
						paddingRight: theme.spacing.lg
					}}
				>
					<Row
						gutter={[
							{ lg: 48, xl: 60 },
							{ lg: 48, xl: 60 }
						]}
						align="middle"
					>
						<Col lg={14} xl={15}>
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
									gap: theme.spacing.lg
								}}
							>
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										gap: theme.spacing.sm
									}}
								>
									<Title
										level={1}
										style={{
											fontSize: '2.25rem',
											fontWeight: 'bold',
											letterSpacing: '-0.025em'
										}}
									>
										Detect and Rank Emotions in Real-Time
									</Title>
									<Paragraph
										style={{
											maxWidth: '600px',
											color: theme.colors.textSecondary,
											fontSize: '1.125rem'
										}}
									>
										Upload photos, detect emotions, and rank participants based
										on their emotional responses. Perfect for events,
										competitions, and interactive experiences.
									</Paragraph>
								</div>
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										gap: theme.spacing.sm
									}}
								>
									<Link href={user ? '/mypage' : '/login'} passHref>
										<Button
											type="primary"
											size="large"
											icon={<FiArrowRight />}
											iconPosition="end"
										>
											Get {user ? 'My Page' : 'Login'}
										</Button>
									</Link>
								</div>
							</div>
						</Col>
						<Col lg={10} xl={9}>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center'
								}}
							>
								<div
									style={{
										position: 'relative',
										height: '300px',
										width: '300px'
									}}
								>
									<Image
										src="/emotion-snap-fav-min.png"
										alt="Emotion Detection"
										style={{
											objectFit:
												'cover' /* borderRadius: theme.borderRadius.md - this was removed as borderRadius is not in theme */
										}}
										width="100%"
										height="100%"
										preview={false}
									/>
								</div>
							</div>
						</Col>
					</Row>
				</div>
			</section>
			<div
				style={{
					width: '100%',
					padding: `${theme.spacing.xxl || '64px'} 0`,
					backgroundColor: theme.colors.background || '#f9fafb'
				}}
			>
				<div
					style={{
						maxWidth: '1280px',
						margin: '0 auto',
						padding: `0 ${theme.spacing.lg || '24px'}`
					}}
				>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							textAlign: 'center',
							marginBottom: theme.spacing.xl || '48px'
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
							{ xs: 16, sm: 24, md: 24 },
							{ xs: 16, sm: 24, md: 24 }
						]}
						style={{
							maxWidth: '1024px',
							margin: '0 auto'
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
		</>
	);
};
