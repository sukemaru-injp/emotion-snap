'use client';

import type { Event } from '@/common/types/Event';
import { theme } from '@/styles/theme';
import { Button, Card, Input, Typography } from 'antd';
import { useState } from 'react';
import { handleUpload, type UploadParam } from '../_actions/handleUpload';
import { CameraView } from './CameraView';
import { Result, ok, err } from 'neverthrow';
import { match } from 'ts-pattern';

type Props = {
	event: Event;
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
		if (!name || name.trim() === '') {
			return err(['ユーザー名は必須です']);
		}
		if (name.length > 50) {
			return err(['ユーザー名は50文字以内で入力してください']);
		}
		return ok(name);
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

export const Presenter: React.FC<Props> = ({ event }) => {
	const [capturedImage, setCapturedImage] = useState<File | null>(null);
	const [userName, setUserName] = useState<string>('');
	const [errors, setErrors] = useState<string[] | undefined>([]);

	const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setUserName(value);
	};

	const handleSubmit = async () => {
		const validationResult = validateUploadParams({
			userName,
			file: capturedImage,
			eventId: event.id
		});

		if (validationResult.isErr()) {
			setErrors(validationResult.error);
			return;
		}

		const res = await handleUpload(validationResult.value);
		match(res)
			.with({ tag: 'left' }, (error) => {
				console.error('Upload failed:', error);
			})
			.with({ tag: 'right' }, () => {
				setErrors(undefined);
				console.log('Upload successful');
			})
			.exhaustive();
	};

	return (
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
					{event.name}
				</Typography.Title>
				{event.date && <Typography.Text>{event.date}</Typography.Text>}
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
						/>
					</div>
					<CameraView onCapture={setCapturedImage} />
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
						<Button onClick={handleSubmit}>Submit</Button>
					</div>
				</div>
			</Card>
		</div>
	);
};
