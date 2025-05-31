'use client';

import type { Event } from '@/common/types/Event';
import { theme } from '@/styles/theme';
import { Button, Card, Input, Typography, Upload, type UploadFile } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import { useCallback, useState } from 'react';
import { BiUpload } from 'react-icons/bi';

type Props = {
	event: Event;
};

export const Presenter: React.FC<Props> = ({ event }) => {
	const [fileList, setFileList] = useState<UploadFile<File>[]>([]);
	const [name, setName] = useState('');

	const handleChange = useCallback((info: UploadChangeParam) => {
		console.log(info.file);
		setFileList([...info.fileList]);
	}, []);

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
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: theme.spacing.sm
						}}
					>
						<Typography.Text>Your name</Typography.Text>
						<Input
							size="large"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					<Upload
						accept="image/*"
						fileList={fileList}
						maxCount={1}
						listType="picture"
						onChange={handleChange}
						beforeUpload={() => false} // Prevent auto upload
					>
						{fileList.length >= 1 ? null : (
							<Button
								style={{ border: 0, background: 'none' }}
								icon={<BiUpload />}
							>
								Upload
							</Button>
						)}
					</Upload>

					<div>
						<Button>Submit</Button>
					</div>
				</div>
			</Card>
		</div>
	);
};
