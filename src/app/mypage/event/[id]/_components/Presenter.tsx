import type { Event } from '@/common/types/Event';
import { Card, Descriptions } from 'antd'; // Using Ant Design components as per project guidelines
import type React from 'react';
import { useMemo } from 'react';

type PresenterProps = {
	event: Event;
};

export const Presenter: React.FC<PresenterProps> = ({ event }) => {
	const items = useMemo(
		() => [
			{ key: '1', label: 'Event Name', children: event.name },
			{ key: '2', label: 'Code', children: event.code },
			{ key: '3', label: 'Date', children: event?.date ?? 'Not set' }
		],
		[event]
	);

	return (
		<Card title="Event Details">
			<Descriptions bordered items={items} column={1} />
		</Card>
	);
};
