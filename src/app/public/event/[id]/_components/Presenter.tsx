'use client';
import { Button, Card, Input, message, Typography } from 'antd';
import dayjs from 'dayjs';
import { err, ok, Result } from 'neverthrow';
import { useState, useTransition } from 'react';
import { FaCamera, FaImage, FaUser } from 'react-icons/fa';
import { match } from 'ts-pattern';
import { Loader } from '@/common/ui/Loader';
import type { PublicEventData } from '../_actions/getPublicEvent';
import { handleUpload, type UploadParam } from '../_actions/handleUpload';
import { CameraView } from './CameraView';
import styles from './_styles/Presenter.module.css';

type Props = {
	publicEvent: PublicEventData;
};

const validateUploadParams = ({
	userName,
	file,
	eventId
}: {
	userName: string;
	file: File | null;
	eventId: number;
}): Result<UploadParam, string[]> => {
	const validateName = (name: string): Result<string, string[]> => {
		const trimName = name.trim();
		if (!trimName) {
			return err(['ユーザー名は必須です']);
		}
		if (trimName.length > 20) {
			return err(['ユーザー名は20文字以内で入力してください']);
		}
		return ok(trimName);
	};
	const validateFile = (file: File | null): Result<File, string[]> => {
		if (!file) {
			return err(['ファイルは必須です']);
		}
		if (file.size > 10 * 1024 * 1024) {
			// 10MB制限
			return err(['ファイルサイズは10MB以下にしてください']);
		}
		return ok(file);
	};

	return Result.combine([validateName(userName), validateFile(file)]).map(
		([validUserName, validFile]) => ({
			userName: validUserName,
			file: validFile,
			eventId: String(eventId)
		})
	);
};

export const Presenter: React.FC<Props> = ({ publicEvent }) => {
	const [capturedImage, setCapturedImage] = useState<File | null>(null);
	const [userName, setUserName] = useState<string>('');
	const [errors, setErrors] = useState<string[] | undefined>([]);
	const [isPending, startTransition] = useTransition();
	const [messageApi, contextHolder] = message.useMessage();

	const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setUserName(value);
	};

	const handleSubmit = () => {
		const validationResult = validateUploadParams({
			userName,
			file: capturedImage,
			eventId: publicEvent.event_id
		});

		if (validationResult.isErr()) {
			setErrors(validationResult.error);
			return;
		}

		startTransition(async () => {
			const res = await handleUpload(validationResult.value);
			match(res)
				.with({ tag: 'left' }, (error) => {
					console.error('Upload failed:', error);
					messageApi.error('Upload failed');
				})
				.with({ tag: 'right' }, () => {
					setErrors(undefined);
					messageApi.success('Upload completed successfully!');
					setCapturedImage(null);
					setUserName('');
				})
				.exhaustive();
		});
	};

	return (
		<>
			{contextHolder}
			<Loader isLoading={isPending} tip="画像を送信中...">
				<div className={styles.container}>
					{/* ヘッダー部分 */}
					<div className={styles.header}>
						<Typography.Title level={1} className={styles.title}>
							📸 {publicEvent.event_name}
						</Typography.Title>
						<Typography.Text className={styles.expireText}>
							有効期限:{' '}
							{dayjs(new Date(publicEvent.expire)).format('YYYY年MM月DD日')}
						</Typography.Text>
					</div>

					{/* メインコンテンツ */}
					<Card className={styles.card}>
						<div className={styles.cardContent}>
							{/* ユーザー名入力セクション */}
							<div className={styles.section}>
								<div className={styles.sectionHeader}>
									<FaUser color="#F78C3D" />
									<Typography.Text strong className={styles.sectionTitle}>
										あなたのお名前
									</Typography.Text>
									<span className={styles.requiredMark}>*</span>
								</div>
								<Input
									placeholder="お名前を入力してください"
									value={userName}
									onChange={handleUserNameChange}
									required
									disabled={isPending}
									className={styles.input}
								/>
							</div>

							{/* カメラセクション */}
							<div className={styles.cameraSection}>
								<div className={styles.cameraHeader}>
									<FaCamera color="#F78C3D" />
									<Typography.Text strong className={styles.cameraTitle}>
										写真を撮影
									</Typography.Text>
								</div>
								<Typography.Text className={styles.cameraGuide}>
									💡 明るい場所で正面を向いて撮影してください
								</Typography.Text>
								<CameraView
									onCapture={setCapturedImage}
									isRetake={!!capturedImage}
								/>
							</div>

							{/* エラー表示 */}
							{errors && errors.length > 0 && (
								<div className={styles.errorContainer}>
									{errors.map((error) => (
										<Typography.Text
											type="danger"
											key={`${error}`}
											className={styles.errorText}
										>
											⚠️ {error}
										</Typography.Text>
									))}
								</div>
							)}

							{/* 投稿ボタン */}
							<div className={styles.submitContainer}>
								<Button
									type="primary"
									size="large"
									onClick={handleSubmit}
									loading={isPending}
									disabled={!userName.trim() || !capturedImage}
									icon={<FaImage />}
									className={styles.submitButton}
								>
									{isPending ? '投稿中...' : '写真を投稿する'}
								</Button>
							</div>
						</div>
					</Card>
				</div>
			</Loader>
		</>
	);
};
