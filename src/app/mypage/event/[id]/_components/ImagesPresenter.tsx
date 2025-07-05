'use client';
import { Card, Col, Image, Row } from 'antd';
import { useMemo } from 'react';
import { theme } from '@/styles/theme';
import type { EventImage } from '../types/EventImage';
import type { S3ObjectInfo } from '../types/S3ObjectInfo';

export type Props = {
	images: EventImage[];
	objects: S3ObjectInfo[];
};

export const ImagesPresenter: React.FC<Props> = ({ images, objects }) => {
	const imageMetaMap = useMemo(
		() => new Map(images.map((img) => [img.s3_key, img])),
		[images]
	);

	return (
		<div
			style={{
				padding: theme.spacing.xl,
				display: 'flex',
				flexDirection: 'column',
				gap: theme.spacing.sm
			}}
		>
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
		</div>
	);
};
