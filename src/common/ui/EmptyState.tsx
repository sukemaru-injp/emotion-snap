'use client';
import { Button, Empty } from 'antd';
import type { FC, ReactNode } from 'react';
import { theme } from '@/styles/theme';

type Props = {
	title?: string;
	description?: ReactNode;
	actionButton?: {
		text: string;
		onClick: () => void;
	};
	icon?: ReactNode;
};

export const EmptyState: FC<Props> = ({
	title = 'No Data',
	description,
	actionButton,
	icon
}) => {
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				minHeight: '200px',
				padding: theme.spacing.xl
			}}
		>
			<Empty
				image={icon || Empty.PRESENTED_IMAGE_SIMPLE}
				description={
					<div>
						<div
							style={{ fontSize: '16px', fontWeight: 500, marginBottom: '8px' }}
						>
							{title}
						</div>
						{description && (
							<div style={{ color: theme.colors.textSecondary }}>
								{description}
							</div>
						)}
					</div>
				}
			>
				{actionButton && (
					<Button type="primary" onClick={actionButton.onClick}>
						{actionButton.text}
					</Button>
				)}
			</Empty>
		</div>
	);
};
