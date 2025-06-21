import React from 'react';
import { useCamera } from './useCamera';

interface CameraComponentProps {
	onCapture?: (imageData: string) => void;
	onError?: (error: string) => void;
	facingMode?: 'user' | 'environment';
	className?: string;
}

export const CameraComponent: React.FC<CameraComponentProps> = ({
	onCapture,
	onError,
	facingMode = 'user',
	className = ''
}) => {
	const {
		videoRef,
		isActive,
		isLoading,
		error,
		startCamera,
		stopCamera,
		capturePhoto
	} = useCamera({ facingMode });

	React.useEffect(() => {
		if (error && onError) {
			onError(error);
		}
	}, [error, onError]);

	const handleCapture = () => {
		const imageData = capturePhoto();
		if (imageData && onCapture) {
			onCapture(imageData);
		}
	};

	return (
		<div className={`camera-container ${className}`}>
			<video
				ref={videoRef}
				autoPlay
				playsInline
				muted
				style={{ width: '100%', height: 'auto' }}
			/>

			<div className="camera-controls">
				{!isActive ? (
					<button
						type="button"
						onClick={startCamera}
						disabled={isLoading}
						className="camera-button start"
					>
						{isLoading ? 'カメラ起動中...' : 'カメラ開始'}
					</button>
				) : (
					<>
						<button
							type="button"
							onClick={handleCapture}
							className="camera-button capture"
						>
							撮影
						</button>
						<button
							type="button"
							onClick={stopCamera}
							className="camera-button stop"
						>
							停止
						</button>
					</>
				)}
			</div>

			{error && <div className="camera-error">エラー: {error}</div>}
		</div>
	);
};
