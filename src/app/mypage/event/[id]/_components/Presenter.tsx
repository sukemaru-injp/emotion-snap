'use client';
import type { Event } from '@/common/types/Event';
import { Loader } from '@/common/ui/Loader';
import { theme } from '@/styles/theme';
import {
	Alert,
	Button,
	Card,
	Checkbox,
	DatePicker,
	Descriptions,
	Divider,
	Form,
	Input,
	Space,
	message
} from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useCallback, useMemo, useState, useTransition } from 'react';
import { match } from 'ts-pattern';
import { type UpdateEventFormData, editEvent } from '../_actions/editEvent';
import {
	type PublishEventFormData,
	publishEvent,
	unpublishEvent
} from '../_actions/publishEvent';

const QRCodeCard = dynamic(() => import('./QRCodeCard'), {
	ssr: false
});

type PresenterProps = {
	event: Event;
	usrId: string;
	showQR?: boolean;
	initialPublishData?: {
		isPublished: boolean;
		expire?: string;
		eventName?: string;
	};
};

type FormValues = {
	name: string;
	code: string;
	date?: Dayjs | null;
};

type PublishFormValues = {
	isPublished: boolean;
	eventName?: string;
	expire?: Dayjs | null;
};

export const Presenter: React.FC<PresenterProps> = ({
	event,
	usrId,
	showQR = true,
	initialPublishData = { isPublished: false }
}) => {
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);
	const [form] = Form.useForm<FormValues>();
	const [publishForm] = Form.useForm<PublishFormValues>();

	const [editedEvent, setEditedEvent] = useState<Partial<Event>>({});

	const [publishData, setPublishData] = useState<{
		isPublished: boolean;
		expire?: string;
		eventName?: string;
	}>(initialPublishData);

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

			const formDataToSubmit: UpdateEventFormData = {
				id: event.id,
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
			message.error('Please check the form for errors.');
		}
	}, [form, event.id, usrId, messageApi]);

	const handlePublishSave = useCallback(async () => {
		try {
			const values = await publishForm.validateFields();
			setError(null);

			if (values.isPublished) {
				if (!values.eventName || !values.expire) {
					message.error(
						'Event name and expiry date are required for publication.'
					);
					return;
				}

				const formDataToSubmit: PublishEventFormData = {
					eventId: event.id,
					eventName: values.eventName,
					expire: values.expire.format('YYYY-MM-DD')
				};

				startTransition(async () => {
					const result = await publishEvent(formDataToSubmit, usrId);
					match(result)
						.with({ tag: 'right' }, () => {
							messageApi.success('Event published successfully!');
							setPublishData({
								isPublished: true,
								expire: formDataToSubmit.expire,
								eventName: formDataToSubmit.eventName
							});
						})
						.with({ tag: 'left' }, ({ error: e }) => {
							setError(e.message);
							messageApi.error(`Failed to publish event: ${e.message}`);
						})
						.exhaustive();
				});
			} else {
				startTransition(async () => {
					const result = await unpublishEvent(event.id, usrId);
					match(result)
						.with({ tag: 'right' }, () => {
							messageApi.success('Event unpublished successfully!');
							setPublishData({ isPublished: false });
						})
						.with({ tag: 'left' }, ({ error: e }) => {
							setError(e.message);
							messageApi.error(`Failed to unpublish event: ${e.message}`);
						})
						.exhaustive();
				});
			}
		} catch (_e) {
			message.error('Please check the form for errors.');
		}
	}, [publishForm, event.id, usrId, messageApi]);

	const handlePublishChange = useCallback(
		(checked: boolean) => {
			if (checked) {
				publishForm.setFieldsValue({
					eventName: event.name,
					expire: dayjs().add(7, 'day')
				});
			}
		},
		[event.name, publishForm]
	);

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

			<div
				style={{
					display: 'grid',
					gridTemplateColumns: '2fr 1fr',
					gap: theme.spacing.md
				}}
			>
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
										{
											required: true,
											message: 'Please input the event name!'
										}
									]}
								>
									<Input />
								</Form.Item>
								<Form.Item
									name="code"
									label="Code"
									rules={[
										{
											required: true,
											message: 'Please input the event code!'
										}
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
				{showQR && <QRCodeCard eventId={event.id} />}
			</div>

			<Divider />

			<Card title="Public Event Settings">
				<Loader tip="Loading..." isLoading={isPending}>
					<Form
						form={publishForm}
						layout="vertical"
						initialValues={{
							isPublished: initialPublishData.isPublished,
							eventName: initialPublishData.eventName || event.name,
							expire: initialPublishData.expire
								? dayjs(initialPublishData.expire)
								: null
						}}
					>
						<Form.Item name="isPublished" valuePropName="checked">
							<Checkbox onChange={(e) => handlePublishChange(e.target.checked)}>
								公開する
							</Checkbox>
						</Form.Item>

						<Form.Item dependencies={['isPublished']} noStyle>
							{({ getFieldValue }) => (
								<Form.Item
									name="eventName"
									label="公開用イベント名"
									rules={[
										{
											required: getFieldValue('isPublished'),
											message: 'Please input the public event name!'
										}
									]}
								>
									<Input disabled={!getFieldValue('isPublished')} />
								</Form.Item>
							)}
						</Form.Item>

						<Form.Item dependencies={['isPublished']} noStyle>
							{({ getFieldValue }) => (
								<Form.Item
									name="expire"
									label="公開期限日"
									rules={[
										{
											required: getFieldValue('isPublished'),
											message: 'Please select the expiry date!'
										}
									]}
								>
									<DatePicker
										style={{ width: '100%' }}
										disabled={!getFieldValue('isPublished')}
										disabledDate={(current) =>
											current && current < dayjs().startOf('day')
										}
									/>
								</Form.Item>
							)}
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

						<Form.Item dependencies={['isPublished']} noStyle>
							{({ getFieldValue }) => (
								<Form.Item>
									<Button
										type="primary"
										onClick={handlePublishSave}
										loading={isPending}
									>
										{getFieldValue('isPublished') || publishData.isPublished
											? 'Save Publication Settings'
											: 'Unpublish Event'}
									</Button>
								</Form.Item>
							)}
						</Form.Item>

						{publishData.isPublished && (
							<Alert
								message={`Event is currently published until ${publishData.expire ? dayjs(publishData.expire).format('YYYY-MM-DD') : 'Unknown'}`}
								type="info"
								showIcon
								style={{ marginTop: '16px' }}
							/>
						)}
					</Form>
				</Loader>
			</Card>
		</div>
	);
};
