'use client';
import { Button, Card, Col, Image, Modal, Row, Select, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { FaCrown, FaStar, FaTrophy } from 'react-icons/fa';
import { theme } from '@/styles/theme';
import type { EventImage } from '../types/EventImage';
import type { S3ObjectInfo } from '../types/S3ObjectInfo';
import styles from './_styles/RankingModal.module.css';

const { Title, Text } = Typography;

type ScoreType =
	| 'angry_score'
	| 'happy_score'
	| 'sad_score'
	| 'smile_score'
	| 'surprised_score';

const scoreLabels: Record<ScoreType, string> = {
	angry_score: 'Angry',
	happy_score: 'Happy',
	sad_score: 'Sad',
	smile_score: 'Smile',
	surprised_score: 'Surprised'
};

const getRankIcon = (rank: number) => {
	if (rank === 1)
		return <FaCrown style={{ color: '#FFD700', fontSize: '24px' }} />;
	if (rank === 2)
		return <FaTrophy style={{ color: '#C0C0C0', fontSize: '20px' }} />;
	if (rank === 3)
		return <FaStar style={{ color: '#CD7F32', fontSize: '18px' }} />;
	return null;
};

const getRankStyleClass = (rank: number) => {
	if (rank === 1) return styles.firstPlace;
	if (rank === 2) return styles.secondPlace;
	if (rank === 3) return styles.thirdPlace;
	return '';
};

export type Props = {
	images: EventImage[];
	objects: S3ObjectInfo[];
};

export const ImagesPresenter: React.FC<Props> = ({ images, objects }) => {
	const imageMetaMap = useMemo(
		() => new Map(images.map((img) => [img.s3_key, img])),
		[images]
	);

	const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);
	const [selectedScoreType, setSelectedScoreType] =
		useState<ScoreType>('happy_score');

	const sortedImages = useMemo(() => {
		const imageDataWithObjects = objects
			.map((object) => {
				const imageMeta = imageMetaMap.get(object.key);
				return {
					...object,
					meta: imageMeta,
					userName: imageMeta?.user_name || 'No Name',
					score: imageMeta?.[selectedScoreType] || 0
				};
			})
			.filter((item) => item.meta) // Only include items with valid metadata
			.sort((a, b) => (b.score || 0) - (a.score || 0)); // Sort by score descending

		return imageDataWithObjects;
	}, [objects, imageMetaMap, selectedScoreType]);

	return (
		<div
			style={{
				padding: theme.spacing.xl,
				display: 'flex',
				flexDirection: 'column',
				gap: theme.spacing.sm
			}}
		>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: theme.spacing.md
				}}
			>
				<Title level={2}>Event Images</Title>
				<Button
					type="primary"
					icon={<FaTrophy />}
					size="large"
					onClick={() => setIsRankingModalOpen(true)}
				>
					View Ranking
				</Button>
			</div>

			<Row gutter={[16, 16]}>
				{objects.map((object) => {
					const imageMeta = imageMetaMap.get(object.key);
					const userName = imageMeta?.user_name || 'No Name';

					return (
						<Col key={object.key} xs={24} sm={12} md={8} lg={6}>
							<Card title={userName}>
								<Image src={object.url} alt={userName || 'Event image'} />
							</Card>
						</Col>
					);
				})}
			</Row>

			<Modal
				title={null}
				open={isRankingModalOpen}
				onCancel={() => setIsRankingModalOpen(false)}
				footer={null}
				width="100vw"
				style={{ top: 0, paddingBottom: 0 }}
				className={styles.fullscreenModal}
				styles={{
					body: {
						height: '100vh',
						padding: 0,
						overflow: 'auto'
					}
				}}
			>
				<div style={{ padding: theme.spacing.lg, height: '100%' }}>
					<div className={styles.rankHeader}>
						<Title level={1} className={styles.rankTitle}>
							<FaTrophy style={{ marginRight: theme.spacing.sm }} />
							Emotion Ranking
						</Title>
						<div className={styles.sortControls}>
							<Text strong>Sort by:</Text>
							<Select
								value={selectedScoreType}
								onChange={setSelectedScoreType}
								style={{ width: 120 }}
								size="large"
							>
								{Object.entries(scoreLabels).map(([key, label]) => (
									<Select.Option key={key} value={key}>
										{label}
									</Select.Option>
								))}
							</Select>
							<Button
								type="default"
								size="large"
								onClick={() => setIsRankingModalOpen(false)}
							>
								Close
							</Button>
						</div>
					</div>

					<Row gutter={[24, 24]}>
						{sortedImages.map((item, index) => {
							const rank = index + 1;
							const scoreValue = item.score || 0;
							const rankIcon = getRankIcon(rank);
							const rankStyleClass = getRankStyleClass(rank);

							return (
								<Col key={item.key} xs={24} sm={12} md={8} lg={6}>
									<Card
										className={`${styles.rankingCard} ${rankStyleClass}`}
										title={
											<div className={styles.cardTitle}>
												<span>{item.userName}</span>
												<div className={styles.rankInfo}>
													{rankIcon}
													<Text strong className={styles.rankNumber}>
														#{rank}
													</Text>
												</div>
											</div>
										}
										extra={
											<div className={styles.scoreInfo}>
												<Text type="secondary">Score</Text>
												<br />
												<Text
													strong
													className={styles.scoreValue}
													style={{ color: theme.colors.primary }}
												>
													{scoreValue.toFixed(1)}%
												</Text>
											</div>
										}
									>
										<Image
											src={item.url}
											alt={item.userName || 'Event image'}
											className={styles.imageContainer}
										/>
									</Card>
								</Col>
							);
						})}
					</Row>
				</div>
			</Modal>
		</div>
	);
};
