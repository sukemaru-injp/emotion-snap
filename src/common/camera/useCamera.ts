import { useCallback, useEffect, useRef, useState } from 'react';

interface CameraOptions {
	video?: MediaTrackConstraints | boolean;
	audio?: MediaTrackConstraints | boolean;
	facingMode?: 'user' | 'environment';
}

interface CameraState {
	stream: MediaStream | null;
	isActive: boolean;
	error: string | null;
	isLoading: boolean;
}

export const useCamera = (options: CameraOptions = {}) => {
	const [state, setState] = useState<CameraState>({
		stream: null,
		isActive: false,
		error: null,
		isLoading: false
	});

	const videoRef = useRef<HTMLVideoElement>(null);

	const startCamera = useCallback(async () => {
		setState((prev) => ({ ...prev, isLoading: true, error: null }));

		try {
			const constraints: MediaStreamConstraints = {
				video: options.video || {
					facingMode: options.facingMode || 'user',
					width: { ideal: 1280 },
					height: { ideal: 720 }
				},
				audio: options.audio || false
			};

			const stream = await navigator.mediaDevices.getUserMedia(constraints);

			if (videoRef.current) {
				videoRef.current.srcObject = stream;
			}

			setState({
				stream,
				isActive: true,
				error: null,
				isLoading: false
			});
		} catch (error) {
			setState((prev) => ({
				...prev,
				error:
					error instanceof Error
						? error.message
						: 'カメラアクセスに失敗しました',
				isLoading: false
			}));
		}
	}, [options]);

	const stopCamera = useCallback(() => {
		if (state.stream) {
			state.stream.getTracks().forEach((track) => {
				track.stop();
			});
		}

		if (videoRef.current) {
			videoRef.current.srcObject = null;
		}

		setState({
			stream: null,
			isActive: false,
			error: null,
			isLoading: false
		});
	}, [state.stream]);

	const capturePhoto = useCallback((): Promise<File | null> => {
		return new Promise((resolve) => {
			if (!videoRef.current || !state.isActive) {
				resolve(null);
				return;
			}

			const canvas = document.createElement('canvas');
			const context = canvas.getContext('2d');

			if (!context) {
				resolve(null);
				return;
			}

			canvas.width = videoRef.current.videoWidth;
			canvas.height = videoRef.current.videoHeight;

			context.drawImage(videoRef.current, 0, 0);

			canvas.toBlob(
				(blob) => {
					if (blob) {
						const file = new File([blob], 'captured_photo.jpg', {
							type: 'image/jpeg'
						});
						stopCamera();
						resolve(file);
					} else {
						resolve(null);
					}
				},
				'image/jpeg',
				0.8
			);
		});
	}, [state.isActive, stopCamera]);

	// クリーンアップ
	useEffect(() => {
		return () => {
			if (state.stream) {
				state.stream.getTracks().forEach((track) => {
					track.stop();
				});
			}
		};
	}, [state.stream]);

	return {
		videoRef,
		...state,
		startCamera,
		stopCamera,
		capturePhoto
	};
};
