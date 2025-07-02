'use client';

import { theme } from '@/styles/theme';
import { Card, Input, QRCode } from 'antd';
import type React from 'react';
import { useMemo } from 'react';

type QRCodeCardProps = {
	eventId: number;
};

const QRCodeCard: React.FC<QRCodeCardProps> = ({ eventId }) => {
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
				<QRCode value={qrCodeUrl} size={200} />
				<Input value={qrCodeUrl} readOnly />
			</div>
		</Card>
	);
};

export default QRCodeCard;
