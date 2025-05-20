'use client';
import type { Event } from '@/common/types/Event';
import { Loader } from '@/common/ui/Loader';
import { theme } from '@/styles/theme';
import {
	Alert,
	Button,
	Card,
	DatePicker,
	Descriptions,
	Form,
	Input,
	Space,
	message
} from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useCallback, useMemo, useState, useTransition } from 'react';
import { match } from 'ts-pattern';
import { editEvent } from '../_actions/editEvent';

type PresenterProps = {
	event: Event;
	usrId: string;
};

type FormValues = {
	name: string;
	code: string;
	date?: Dayjs | null;
};

export const Presenter: React.FC<PresenterProps> = ({ event, usrId }) => {
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);
	const [form] = Form.useForm<FormValues>();

	const [editedEvent, setEditedEvent] = useState<Partial<Event>>({});

	const viewItems = useMemo(
		() => [
			{
				key: '1',
				label: 'Event Name',
				children: editedEvent?.name ?? event.name
			},
			{ key: '2', label: 'Code', children: editedEvent.code ?? event.code },
			{
				key: '3',
				label: 'Date',
				children: editedEvent?.date
					? dayjs(editedEvent.date).format('YYYY-MM-DD')
					: event.date
						? dayjs(event.date).format('YYYY-MM-DD')
						: 'Not set'
			}
		],
		[event, editedEvent]
	);

	const handleEditClick = () => {
		setIsEditing(true);
		setError(null);
		const initialFormValues: FormValues = {
			name: event.name,
			code: event.code,
			date: event.date ? dayjs(event.date) : null
		};
		form.setFieldsValue(initialFormValues);
	};

	const handleCancelClick = () => {
		setIsEditing(false);
		form.resetFields();
	};

	const [messageApi, contextHolder] = message.useMessage();

	const handleSave = useCallback(async () => {
		try {
			const values = await form.validateFields();
			setError(null);

			const formDataToSubmit = {
				id: event.id, // id must be number
				name: values.name,
				code: values.code,
				date: values.date ? values.date.format('YYYY-MM-DD') : null
			};
			startTransition(async () => {
				const result = await editEvent(formDataToSubmit, usrId);
				match(result)
					.with({ tag: 'right' }, () => {
						// Success case
						messageApi.success('Event updated successfully!');
						setEditedEvent(formDataToSubmit);
						setIsEditing(false);
					})
					.with({ tag: 'left' }, ({ error: e }) => {
						// Error case
						setError(e.message);
						messageApi.error(`Failed to update event: ${e.message}`);
					})
					.exhaustive();
			});
		} catch (_e) {
			// Form validation failed
			// Antd Form automatically shows validation errors, so no explicit setError needed here
			message.error('Please check the form for errors.');
		}
	}, [form, event.id, usrId, messageApi]);

	return (
		<div
			style={{
				padding: theme.spacing.xl,
				display: 'flex',
				flexDirection: 'column',
				gap: theme.spacing.sm
			}}
		>
			{contextHolder}
			<div>
				<Button
					type="link"
					style={{ marginTop: theme.spacing.md }}
					onClick={() => router.push('/mypage')}
				>
					マイページへ戻る
				</Button>
			</div>

			{isEditing ? (
				<Card title="Edit Event">
					<Loader tip="Loading..." isLoading={isPending}>
						<Form
							form={form}
							layout="vertical"
							initialValues={{
								name: event.name,
								code: event.code,
								date: event.date ? dayjs(event.date) : null
							}}
						>
							<Form.Item
								name="name"
								label="Event Name"
								rules={[
									{ required: true, message: 'Please input the event name!' }
								]}
							>
								<Input />
							</Form.Item>
							<Form.Item
								name="code"
								label="Code"
								rules={[
									{ required: true, message: 'Please input the event code!' }
								]}
							>
								<Input />
							</Form.Item>
							<Form.Item name="date" label="Date">
								<DatePicker style={{ width: '100%' }} />
							</Form.Item>
							{error && (
								<Form.Item>
									<Alert
										message={error}
										type="error"
										showIcon
										closable
										onClose={() => setError(null)}
									/>
								</Form.Item>
							)}
							<Form.Item>
								<Space>
									<Button
										type="primary"
										onClick={handleSave}
										loading={isPending}
									>
										Save
									</Button>
									<Button onClick={handleCancelClick} disabled={isPending}>
										Cancel
									</Button>
								</Space>
							</Form.Item>
						</Form>
					</Loader>
				</Card>
			) : (
				<Card
					title="Event Details"
					extra={
						<Button type="primary" onClick={handleEditClick}>
							Edit
						</Button>
					}
				>
					<Descriptions bordered items={viewItems} column={1} />
				</Card>
			)}
		</div>
	);
};
