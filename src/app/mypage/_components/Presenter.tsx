'use client'; // Add 'use client' because Ant Design components are client-side

import { ThemeProvider } from '@/app/_components/ThemeProvider';
import type { Event } from '@/common/types/Event';
import { Card, List, Typography } from 'antd';
import { format } from 'date-fns'; // Import format from date-fns
import { type FC, useCallback } from 'react';
import { CreateEventForm } from './CreateEventForm';

const { Title, Text } = Typography;

type Props = {
	events: readonly Event[];
	userId: string;
};

export const Presenter: FC<Props> = ({ events, userId }) => {
	const formatDate = useCallback((dateString: string | null): string => {
		if (!dateString) return 'Date not set';
		return format(new Date(dateString), 'yyyy-MM-dd');
	}, []);

	return (
		<ThemeProvider>
			<div>
				<CreateEventForm userId={userId} />
				{events.length === 0 ? (
					<Text>No events found.</Text>
				) : (
					<List
						grid={{
							gutter: 16,
							xs: 1, // 1 column on extra small screens
							sm: 1, // 1 column on small screens
							md: 2, // 2 columns on medium screens
							lg: 3, // 3 columns on large screens
							xl: 4, // 4 columns on extra large screens
							xxl: 4 // 4 columns on extra extra large screens
						}}
						dataSource={[...events]} // Create a mutable copy
						renderItem={(event) => (
							<List.Item>
								<Card hoverable title={<Title level={5}>{event.name}</Title>}>
									<Text>Date: {formatDate(event.date)}</Text>
								</Card>
							</List.Item>
						)}
					/>
				)}
			</div>
		</ThemeProvider>
	);
};
