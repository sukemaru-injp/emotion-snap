'use client';

import { Alert, Card, Input, QRCode } from 'antd';
import type React from 'react';
import { useMemo } from 'react';
import { theme } from '@/styles/theme';

type QRCodeCardProps = {
	eventId: number;
	isPublished: boolean;
};

const QRCodeCard: React.FC<QRCodeCardProps> = ({ eventId, isPublished }) => {
	const qrCodeUrl = useMemo(() => {
		if (typeof window !== 'undefined') {
			return `${window.location.origin}/public/event/${eventId}`;
		}
		return undefined;
	}, [eventId]);

	if (!qrCodeUrl) {
		return null;
	}

	return (
		<Card title="Event QR Code">
			<div
				style={{
					textAlign: 'center',
					paddingTop: theme.spacing.md,
					display: 'flex',
					flexDirection: 'column',
					gap: theme.spacing.sm
				}}
			>
				{isPublished ? (
					<>
						<QRCode value={qrCodeUrl} size={200} />
						<Input value={qrCodeUrl} readOnly />
					</>
				) : (
					<Alert
						message="イベントを公開してください"
						description="QRコードにアクセスするには、下記の「Public Event Settings」でイベントを公開する必要があります。"
						type="info"
						showIcon
					/>
				)}
			</div>
		</Card>
	);
};

export default QRCodeCard;
