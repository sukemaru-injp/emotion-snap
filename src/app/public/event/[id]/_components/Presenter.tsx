'use client';

import type { Event } from '@/common/types/Event';
import { theme } from '@/styles/theme';
import { Button, Card, Upload, type UploadFile } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import { useCallback, useState } from 'react'; // Added useEffect
import { BiUpload } from 'react-icons/bi';

type Props = {
	event: Event;
};

export const Presenter: React.FC<Props> = ({ event }) => {
	const [fileList, setFileList] = useState<UploadFile[]>([]);

	const handleChange = useCallback((info: UploadChangeParam) => {
		console.log(info.file);
		setFileList([...info.fileList]);
	}, []);

	return (
		<div
			style={{
				padding: theme.spacing.md
			}}
		>
			<h1>{event.name}</h1>
			<Card title="Upload Image">
				<div>
					<Upload
						accept="image/*"
						fileList={fileList}
						maxCount={1}
						listType="picture" // Changed from "picture"
						onChange={handleChange}
						beforeUpload={() => false}
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
				</div>
			</Card>
		</div>
	);
};
