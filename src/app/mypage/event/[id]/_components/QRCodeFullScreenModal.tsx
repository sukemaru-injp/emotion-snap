'use client';

import { Input, Modal, QRCode, Typography } from 'antd';
import type React from 'react';
import styles from './QRCodeFullScreenModal.module.css';

type Props = {
	open: boolean;
	onClose: () => void;
	url: string;
};

export const QRCodeFullScreenModal: React.FC<Props> = ({
	open,
	onClose,
	url
}) => {
	return (
		<Modal
			open={open}
			onCancel={onClose}
			footer={null}
			centered={false}
			width="100vw"
			rootClassName={styles.fullScreenModal}
		>
			<div className={styles.container}>
				<Typography.Title level={3}>Event QR Code</Typography.Title>
				<QRCode value={url} size={320} />
				<Input value={url} readOnly className={styles.urlInput} />
				<Typography.Text type="secondary">
					URLを共有するか、QRコードをスキャンしてください
				</Typography.Text>
			</div>
		</Modal>
	);
};

export default QRCodeFullScreenModal;
