'use client';
import { Card, Col, Image, Modal, Row, Select, Typography } from 'antd';
import { useMemo } from 'react';
import { FaCrown, FaMedal, FaStar, FaTrophy } from 'react-icons/fa';
import { EmptyState } from '@/common/ui/EmptyState';
import { theme } from '@/styles/theme';
import type { EventImage } from '../types/EventImage';
import type { S3ObjectInfo } from '../types/S3ObjectInfo';
import styles from './_styles/RankingModal.module.css';

const { Title, Text } = Typography;

export type ScoreType =
	| 'angry_score'
	| 'happy_score'
	| 'sad_score'
	| 'smile_score'
	| 'surprised_score'
	| 'happy_smile_combined';

const scoreLabels: Record<ScoreType, string> = {
	angry_score: 'Angry',
	happy_score: 'Happy',
	sad_score: 'Sad',
	smile_score: 'Smile',
	surprised_score: 'Surprised',
	happy_smile_combined: 'Happy+Smile'
};

const truncateScoreToFourDecimals = (score: number) => {
	if (!Number.isFinite(score)) return 0;
	return Math.trunc(score * 10000) / 10000;
};

const getRankIcon = (rank: number) => {
	if (rank === 1)
		return <FaCrown style={{ color: '#FFD700', fontSize: '32px' }} />;
	if (rank === 2)
		return <FaTrophy style={{ color: '#C0C0C0', fontSize: '28px' }} />;
	if (rank === 3)
		return <FaStar style={{ color: '#CD7F32', fontSize: '24px' }} />;
	if (rank === 4)
		return <FaMedal style={{ color: '#8B7355', fontSize: '20px' }} />;
	return null;
};

const getRankStyleClass = (rank: number) => {
	if (rank === 1) return styles.firstPlace;
	if (rank === 2) return styles.secondPlace;
	if (rank === 3) return styles.thirdPlace;
	if (rank === 4) return styles.fourthPlace;
	return '';
};

export type Props = {
	isOpen: boolean;
	onClose: () => void;
	images: EventImage[];
	objects: S3ObjectInfo[];
	selectedScoreType: ScoreType;
	onScoreTypeChange: (scoreType: ScoreType) => void;
};

export const RankingModal: React.FC<Props> = ({
	isOpen,
	onClose,
	images,
	objects,
	selectedScoreType,
	onScoreTypeChange
}) => {
	const imageMetaMap = useMemo(
		() => new Map(images.map((img) => [img.s3_key, img])),
		[images]
	);

	const imageDataWithObjects = useMemo(() => {
		return objects
			.map((object) => {
				const imageMeta = imageMetaMap.get(object.key);
				return {
					...object,
					meta: imageMeta,
					userName: imageMeta?.user_name || 'No Name'
				};
			})
			.filter((item) => item.meta); // Only include items with valid metadata
	}, [objects, imageMetaMap]);

	const sortedImages = useMemo(() => {
		return imageDataWithObjects
			.map((item) => {
				const score =
					selectedScoreType === 'happy_smile_combined'
						? (item.meta?.happy_score || 0) + (item.meta?.smile_score || 0)
						: item.meta?.[selectedScoreType] || 0;
				return {
					...item,
					score
				};
			})
			.sort((a, b) => (b.score || 0) - (a.score || 0)); // Sort by score descending
	}, [imageDataWithObjects, selectedScoreType]);

	return (
		<Modal
			title={null}
			open={isOpen}
			onCancel={onClose}
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
							onChange={onScoreTypeChange}
							style={{ width: 120 }}
							size="large"
						>
							{Object.entries(scoreLabels).map(([key, label]) => (
								<Select.Option key={key} value={key}>
									{label}
								</Select.Option>
							))}
						</Select>
					</div>
				</div>

				{sortedImages.length > 0 ? (
					<Row gutter={[24, 24]}>
						{sortedImages.map((item, index) => {
							const rank = index + 1;
							const scoreValue = item.score || 0;
							const truncatedScoreValue =
								truncateScoreToFourDecimals(scoreValue);
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
													{truncatedScoreValue} Points
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
				) : (
					<EmptyState
						title="No photos available for ranking"
						description="Upload photos with emotion data to see the ranking! Photos need to be processed for emotion detection to appear in rankings."
						icon={
							<FaTrophy
								style={{ fontSize: '48px', color: theme.colors.textSecondary }}
							/>
						}
					/>
				)}
			</div>
		</Modal>
	);
};
