import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import { MdCameraswitch } from 'react-icons/md';
import { theme } from '@/styles/theme';
import styles from './style.module.css';
import { useCamera } from './useCamera';

interface CameraComponentProps {
	onCapture?: (imageFile: File) => void;
	onError?: (error: string) => void;
	facingMode?: 'user' | 'environment';
	className?: string;
	isRetake?: boolean;
}

export const CameraComponent: React.FC<CameraComponentProps> = ({
	onCapture,
	onError,
	facingMode = 'user',
	className = '',
	isRetake = false
}) => {
	const [currentFacingMode, setCurrentFacingMode] = useState<
		'user' | 'environment'
	>(facingMode);

	const isMobile = useMemo(() => {
		return typeof navigator !== 'undefined'
			? /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
			: false;
	}, []);

	const {
		videoRef,
		isActive,
		isLoading,
		error,
		startCamera,
		stopCamera,
		capturePhoto
	} = useCamera({ facingMode: currentFacingMode });

	useEffect(() => {
		if (error && onError) {
			onError(error);
		}
	}, [error, onError]);

	const handleCapture = useCallback(async () => {
		const imageFile = await capturePhoto();
		if (imageFile && onCapture) {
			onCapture(imageFile);
		}
	}, [capturePhoto, onCapture]);

	const toggleFacingMode = useCallback(() => {
		const next = currentFacingMode === 'user' ? 'environment' : 'user';
		setCurrentFacingMode(next);
		if (isActive) {
			// ここで停止→再起動（イベントハンドラー内で処理）
			stopCamera();
			startCamera({ facingMode: next });
		}
	}, [currentFacingMode, isActive, startCamera, stopCamera]);

	return (
		<div className={`camera-container ${className}`}>
			{!isActive && (
				<button
					type="button"
					onClick={() => startCamera()}
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
					{isLoading ? 'カメラ起動中...' : isRetake ? '撮り直し' : 'カメラ開始'}
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
					className={styles.cameraVideo}
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

				{/* カメラ切替ボタン（モバイルのみ表示） - 撮影ボタンの右横 */}
				{isMobile && (
					<button
						type="button"
						onClick={toggleFacingMode}
						className="camera-button switch"
						aria-label="カメラ切替"
						style={{
							position: 'absolute',
							bottom: '28px',
							left: 'calc(50% + 70px)',
							transform: 'translateX(-50%)',
							width: '44px',
							height: '44px',
							borderRadius: '50%',
							backgroundColor: 'rgba(255, 255, 255, 0.9)',
							border: `1px solid ${theme.colors.primary}`,
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							cursor: 'pointer',
							boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)'
						}}
					>
						<MdCameraswitch size={22} color={theme.colors.primary} />
					</button>
				)}

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
