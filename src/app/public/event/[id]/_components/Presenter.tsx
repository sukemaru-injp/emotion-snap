'use client';

import type { Event } from '@/common/types/Event';
import { theme } from '@/styles/theme';
import { Button, Card, Typography } from 'antd';
import { CameraView } from './CameraView';

type Props = {
	event: Event;
};

export const Presenter: React.FC<Props> = ({ event }) => {
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
					<CameraView />
					<div>
						<Button>Submit</Button>
					</div>
				</div>
			</Card>
		</div>
	);
};
