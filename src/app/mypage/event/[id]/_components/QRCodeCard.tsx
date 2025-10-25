'use client';

import { Alert, Button, Card, Input, QRCode } from 'antd';
import type React from 'react';
import { useMemo, useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { theme } from '@/styles/theme';
import { QRCodeFullScreenModal } from './QRCodeFullScreenModal';

type QRCodeCardProps = {
	eventId: number;
	isPublished: boolean;
	eventCode: string;
};

const QRCodeCard: React.FC<QRCodeCardProps> = ({
	eventId,
	isPublished,
	eventCode
}) => {
	const qrCodeUrl = useMemo(() => {
		if (typeof window !== 'undefined') {
			const query = new URLSearchParams({ code: eventCode });
			return `${window.location.origin}/public/event/${eventId}?${query.toString()}`;
		}
		return undefined;
	}, [eventCode, eventId]);

	const [open, setOpen] = useState(false);

	if (!qrCodeUrl) {
		return null;
	}

	return (
		<Card
			title="Event QR Code"
			extra={
				<Button
					type="text"
					aria-label="QRを全画面で表示"
					icon={<FaInfoCircle width="36px" height="36px" />}
					onClick={() => setOpen(true)}
					disabled={!isPublished}
				/>
			}
		>
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

			<QRCodeFullScreenModal
				open={open}
				onClose={() => setOpen(false)}
				url={qrCodeUrl}
			/>
		</Card>
	);
};

export default QRCodeCard;
