'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const CameraComponent = dynamic(() => import('@/common/camera'), {
	ssr: false
});

type Props = {
	onCapture: (file: File | null) => void;
	isRetake?: boolean;
};

export const CameraView: React.FC<Props> = ({
	onCapture,
	isRetake = false
}) => {
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	const handleCapture = (imageFile: File) => {
		onCapture(imageFile);
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
		}
		setPreviewUrl(URL.createObjectURL(imageFile));
	};

	const handleError = (error: string) => {
		console.error('カメラエラー:', error);
	};

	return (
		<div>
			<CameraComponent
				onCapture={handleCapture}
				onError={handleError}
				facingMode="environment"
				isRetake={isRetake}
			/>
			{previewUrl && (
				<div style={{ marginTop: '16px', textAlign: 'center' }}>
					<h3 style={{ color: '#333', marginBottom: '12px' }}>📸 撮影完了</h3>
					<img
						src={previewUrl}
						alt="撮影した写真"
						style={{
							maxWidth: '100%',
							borderRadius: '8px',
							boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
						}}
					/>
				</div>
			)}
		</div>
	);
};
