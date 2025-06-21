'use client';
import { CameraComponent } from '@/common/camera/CameraComponents';
import { useState } from 'react';

export const CameraView: React.FC = () => {
	const [capturedImage, setCapturedImage] = useState<string | null>(null);

	const handleCapture = (imageData: string) => {
		setCapturedImage(imageData);
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
			/>
			{capturedImage && (
				<div>
					<h2>撮影された画像</h2>
					<img
						src={capturedImage}
						alt="Captured"
						style={{ maxWidth: '100%' }}
					/>
				</div>
			)}
		</div>
	);
};
