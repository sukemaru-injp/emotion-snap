'use client';
import { Button, Card, Input, message, Typography } from 'antd';
import dayjs from 'dayjs';
import { err, ok, Result } from 'neverthrow';
import { useState, useTransition } from 'react';
import { match } from 'ts-pattern';
import { Loader } from '@/common/ui/Loader';
import { theme } from '@/styles/theme';
import type { PublicEventData } from '../_actions/getPublicEvent';
import { handleUpload, type UploadParam } from '../_actions/handleUpload';
import { CameraView } from './CameraView';

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
				<div
					style={{
						padding: theme.spacing.md,
						display: 'flex',
						flexDirection: 'column',
						gap: theme.spacing.md
					}}
				>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: theme.spacing.sm
						}}
					>
						<Typography.Title level={2} style={{ margin: 0 }}>
							{publicEvent.event_name}
						</Typography.Title>
						<Typography.Text style={{ color: theme.colors.textSecondary }}>
							Expire on:
							{dayjs(new Date(publicEvent.expire)).format('YYYY-MM-DD')}
						</Typography.Text>
					</div>
					<Card title="Upload Image">
						<div
							style={{
								padding: theme.spacing.md,
								display: 'flex',
								flexDirection: 'column',
								gap: theme.spacing.md
							}}
						>
							<div style={{ marginBottom: theme.spacing.md }}>
								<Typography.Text strong>
									ユーザー名 <span style={{ color: 'red' }}>*</span>
								</Typography.Text>
								<Input
									placeholder="ユーザー名を入力してください"
									value={userName}
									onChange={handleUserNameChange}
									required
									disabled={isPending}
								/>
							</div>
							<CameraView
								onCapture={setCapturedImage}
								isRetake={!!capturedImage}
							/>
							{errors && errors.length > 0 && (
								<div>
									{errors.map((error) => (
										<Typography.Text type="danger" key={`${error}`}>
											{error}
										</Typography.Text>
									))}
								</div>
							)}
							<div>
								<Button onClick={handleSubmit} loading={isPending}>
									Submit
								</Button>
							</div>
						</div>
					</Card>
				</div>
			</Loader>
		</>
	);
};
