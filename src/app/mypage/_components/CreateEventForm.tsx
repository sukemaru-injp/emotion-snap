'use client';
import { Button, DatePicker, Form, Input, Modal, message, Space } from 'antd';
import type { Dayjs } from 'dayjs';
import { type FC, useCallback, useState, useTransition } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { match } from 'ts-pattern';
import { createEvent } from '../_actions/createEvent';

type EventInput = {
	name: string;
	code: string;
	date?: Dayjs;
};

type Props = {
	userId: string;
	isCreateDisabled?: boolean;
};

export const CreateEventForm: FC<Props> = ({ userId, isCreateDisabled }) => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isSubmitting, start] = useTransition();
	const [messageApi, contextHolder] = message.useMessage();
	const [form] = Form.useForm<EventInput>();

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
		form.resetFields();
	};

	const handleSubmit = useCallback(async () => {
		try {
			const values = await form.validateFields();

			start(async () => {
				const result = await createEvent(
					{
						name: values.name,
						code: values.code,
						date: values.date ? values.date.toISOString() : null
					},
					userId
				);
				match(result)
					.with({ tag: 'right' }, () => {
						messageApi.success('Event created successfully!');
						setIsModalVisible(false);
						form.resetFields();
					})
					.with({ tag: 'left' }, (_e) => {
						messageApi.error('An unexpected error occurred during submission.');
					})
					.exhaustive();
			});
		} catch (_e) {
			messageApi.error('Please check the form for errors.');
		}
	}, [form, userId, messageApi]);

	return (
		<>
			{contextHolder}
			<Button
				onClick={showModal}
				icon={<AiOutlinePlus />}
				disabled={isCreateDisabled}
			>
				新規作成
			</Button>
			<Modal
				title="Create New Event"
				open={isModalVisible}
				onCancel={handleCancel}
				footer={null}
			>
				<Form
					form={form}
					layout="vertical"
					initialValues={{
						name: '',
						code: '',
						date: null
					}}
				>
					<Form.Item
						name="name"
						label="Name"
						rules={[
							{
								required: true,
								message: 'Name is required.'
							}
						]}
					>
						<Input placeholder="Enter event name" />
					</Form.Item>

					<Form.Item
						name="code"
						label="Code"
						rules={[
							{
								required: true,
								message: 'Code is required.'
							},
							{
								min: 4,
								message: 'Code must be at least 4 characters.'
							},
							{
								max: 30,
								message: 'Code must be 30 characters or less.'
							}
						]}
					>
						<Input placeholder="Enter event code (4-30 chars)" />
					</Form.Item>

					<Form.Item name="date" label="Date (Optional)">
						<DatePicker
							style={{ width: '100%' }}
							placeholder="Select date (optional)"
						/>
					</Form.Item>

					<Form.Item>
						<Space>
							<Button onClick={handleCancel} disabled={isSubmitting}>
								Cancel
							</Button>
							<Button
								type="primary"
								onClick={handleSubmit}
								loading={isSubmitting}
							>
								Submit
							</Button>
						</Space>
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};
