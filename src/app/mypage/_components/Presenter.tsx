'use client';

import { ThemeProvider } from '@/app/_components/ThemeProvider';
import type { Event } from '@/common/types/Event';
import { theme } from '@/styles/theme';
import {
	Alert,
	Button,
	Card,
	List,
	Modal,
	Space,
	Typography,
	message
} from 'antd';
import { format } from 'date-fns';
import Link from 'next/link';
import { type FC, useCallback, useMemo, useState, useTransition } from 'react';
import {
	AiOutlineCalendar,
	AiOutlineClockCircle,
	AiOutlineDelete,
	AiOutlineInfoCircle // Import Info icon
} from 'react-icons/ai';
import { deleteEvent } from '../_actions/deleteEvent';
import { CreateEventForm } from './CreateEventForm';
import '@ant-design/v5-patch-for-react-19'; // Import patch for React 19
import { match } from 'ts-pattern';

const { Text, Title } = Typography; // Add Title

type Props = {
	events: readonly Event[];
	userId: string;
};

export const Presenter: FC<Props> = ({ events, userId }) => {
	const isCreateDisabled = useMemo(() => events.length >= 3, [events.length]);

	// Update formatDate to handle errors and accept format string
	const formatDate = useCallback((dateString: string | null): string => {
		if (!dateString) return 'Not set';
		try {
			return format(new Date(dateString), 'yyyy-MM-dd');
		} catch (error) {
			console.error('Error formatting date:', dateString, error);
			return 'Invalid date';
		}
	}, []);

	const [isOpen, setIsOpen] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
	const handleDelete = useCallback((eventId: number) => {
		setIsOpen(true);
		setDeleteTarget(eventId);
	}, []);

	const [messageApi, contextHolder] = message.useMessage();

	const [isPending, startTransition] = useTransition();
	const handleOk = useCallback(() => {
		if (deleteTarget === null) return;
		startTransition(async () => {
			const result = await deleteEvent(deleteTarget, userId);

			match(result)
				.with({ tag: 'right' }, () => {
					messageApi.success('Event deleted successfully!');
				})
				.with({ tag: 'left' }, (error) => {
					messageApi.error(
						'An unexpected error occurred while deleting the event.'
					);
					console.error('Error deleting event:', error);
				})
				.exhaustive();
			setIsOpen(false);
			setDeleteTarget(null);
		});
	}, [deleteTarget, userId, messageApi]);

	const handleCancel = useCallback(() => {
		setIsOpen(false);
		setDeleteTarget(null);
	}, []);

	return (
		<ThemeProvider>
			{contextHolder}
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					width: '100%'
				}}
			>
				<div
					style={{
						padding: theme.spacing.md
					}}
				>
					<div
						style={{
							display: 'flex',
							gap: theme.spacing.md,
							alignItems: 'center'
						}}
					>
						<Title
							level={3}
							style={{ marginTop: '24px', marginBottom: '16px' }}
						>
							イベント一覧
						</Title>
						<CreateEventForm
							userId={userId}
							isCreateDisabled={isCreateDisabled}
						/>
					</div>
					{isCreateDisabled && (
						<Alert
							message="無料プランではイベントは3つまで作成できます。"
							type="warning"
							showIcon
							style={{ marginBottom: theme.spacing.md }}
						/>
					)}
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
									<Card
										hoverable
										actions={[
											<Link href={`/mypage/event/${event.id}`} key="detail">
												<Button type="text" icon={<AiOutlineInfoCircle />}>
													Details
												</Button>
											</Link>,
											<Button
												type="text"
												danger
												icon={<AiOutlineDelete />}
												onClick={() => handleDelete(event.id)}
												key="delete"
											>
												Delete
											</Button>
										]}
									>
										<Card.Meta
											title={event.name}
											description={
												<Space
													direction="vertical"
													style={{ width: '100%', marginTop: '8px' }}
												>
													<Text type="secondary">
														<AiOutlineCalendar style={{ marginRight: '4px' }} />
														Event Date: {formatDate(event.date)}
													</Text>
													<Text type="secondary">
														<AiOutlineClockCircle
															style={{ marginRight: '4px' }}
														/>
														Created: {formatDate(event.createdAt)}
													</Text>
													{/* Optionally display event code if needed */}
													{/* <Text type="secondary">Code: {event.code}</Text> */}
												</Space>
											}
										/>
									</Card>
								</List.Item>
							)}
						/>
					)}
				</div>
			</div>

			<Modal
				title="Delete Event?"
				open={isOpen}
				okText="Delete"
				okType="danger"
				cancelText="Cancel"
				onOk={handleOk}
				onCancel={handleCancel}
				confirmLoading={isPending}
			>
				<p>Are you sure you want to delete this event?</p>
			</Modal>
		</ThemeProvider>
	);
};
