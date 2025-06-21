'use client';
import { CameraComponent } from '@/common/camera/CameraComponents';
import { useState } from 'react';

type Props = {
	onCapture: (file: File | null) => void;
};

export const CameraView: React.FC<Props> = ({ onCapture }) => {
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	const handleCapture = (imageFile: File) => {
		console.log('Captured image file:', imageFile);
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
			/>
			{previewUrl && (
				<div>
					<h2>Captured</h2>
					<img src={previewUrl} alt="Captured" style={{ maxWidth: '100%' }} />
				</div>
			)}
		</div>
	);
};
