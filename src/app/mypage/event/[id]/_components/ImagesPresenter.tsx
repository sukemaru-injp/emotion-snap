'use client';
import { Button, Card, Col, Image, Row, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { FaTrophy } from 'react-icons/fa';
import { FiRefreshCw } from 'react-icons/fi';
import { EmptyState } from '@/common/ui/EmptyState';
import { theme } from '@/styles/theme';
import type { EventImage } from '../types/EventImage';
import type { S3ObjectInfo } from '../types/S3ObjectInfo';
import styles from './_styles/ImagesPresenter.module.css';
import { RankingModal, type ScoreType } from './RankingModal';

const { Title, Text } = Typography;

export type Props = {
	images: EventImage[];
	objects: S3ObjectInfo[];
};

export const ImagesPresenter: React.FC<Props> = ({ images, objects }) => {
	const imageMetaMap = useMemo(
		() => new Map(images.map((img) => [img.s3_key, img])),
		[images]
	);

	const router = useRouter();
	const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);
	const [selectedScoreType, setSelectedScoreType] =
		useState<ScoreType>('happy_score');

	const hasImages = objects.length > 0;

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
				<Title level={2}>
					Event Images <Text type="secondary">({objects.length})</Text>
				</Title>
				<div style={{ display: 'flex', gap: theme.spacing.xs }}>
					<Button
						icon={<FiRefreshCw />}
						size="large"
						onClick={() => router.refresh()}
					>
						Refresh
					</Button>
					<Button
						type="primary"
						icon={<FaTrophy />}
						size="large"
						disabled={!hasImages}
						onClick={() => setIsRankingModalOpen(true)}
					>
						View Ranking
					</Button>
				</div>
			</div>

			{hasImages ? (
				<Row gutter={[16, 16]}>
					{objects.map((object) => {
						const imageMeta = imageMetaMap.get(object.key);
						const userName = imageMeta?.user_name || 'No Name';

						return (
							<Col key={object.key} xs={24} sm={12} md={8} lg={6}>
								<Card title={userName}>
									<Image
										src={object.url}
										alt={userName || 'Event image'}
										className={styles.image}
									/>
								</Card>
							</Col>
						);
					})}
				</Row>
			) : (
				<EmptyState
					title="No photos uploaded yet"
					description="Be the first to upload a photo to this event! Upload your photo and let our emotion detection analyze your expression."
				/>
			)}

			<RankingModal
				isOpen={isRankingModalOpen}
				onClose={() => setIsRankingModalOpen(false)}
				images={images}
				objects={objects}
				selectedScoreType={selectedScoreType}
				onScoreTypeChange={setSelectedScoreType}
			/>
		</div>
	);
};
