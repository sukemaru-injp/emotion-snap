import { theme } from '@/styles/theme';
import React from 'react';
import { FaCamera } from 'react-icons/fa';
import { useCamera } from './useCamera';
import './style.css';

interface CameraComponentProps {
	onCapture?: (imageFile: File) => void;
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

	const handleCapture = async () => {
		const imageFile = await capturePhoto();
		if (imageFile && onCapture) {
			onCapture(imageFile);
		}
	};

	return (
		<div className={`camera-container ${className}`}>
			{!isActive && (
				<button
					type="button"
					onClick={startCamera}
					disabled={isLoading}
					className="camera-button start"
					style={{
						padding: theme.spacing.md,
						backgroundColor: theme.colors.primary,
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
						width: '100%'
					}}
				>
					{isLoading ? 'カメラ起動中...' : 'カメラ開始'}
				</button>
			)}
			<div
				style={{ position: 'relative', display: isActive ? 'block' : 'none' }}
			>
				<video
					ref={videoRef}
					autoPlay
					playsInline
					muted
					className="camera-video"
				/>

				{/* 撮影ボタン - ビデオの中央下部に配置 */}
				<button
					type="button"
					onClick={handleCapture}
					className="camera-button capture"
					style={{
						position: 'absolute',
						bottom: '20px',
						left: '50%',
						transform: 'translateX(-50%)',
						width: '60px',
						height: '60px',
						borderRadius: '50%',
						backgroundColor: 'rgba(255, 255, 255, 0.8)',
						border: `2px solid ${theme.colors.primary}`,
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						cursor: 'pointer',
						boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
					}}
				>
					<FaCamera size={24} color={theme.colors.primary} />
				</button>

				{/* 停止ボタン - ビデオの右上に配置 */}
				<button
					type="button"
					onClick={stopCamera}
					className="camera-button stop"
					style={{
						position: 'absolute',
						top: '10px',
						right: '10px',
						padding: theme.spacing.xs,
						backgroundColor: 'rgba(255, 255, 255, 0.8)',
						color: theme.colors.textPrimary,
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
						fontSize: '12px'
					}}
				>
					停止
				</button>
			</div>

			{error && (
				<div
					className="camera-error"
					style={{
						color: 'red',
						marginTop: theme.spacing.sm
					}}
				>
					エラー: {error}
				</div>
			)}
		</div>
	);
};
