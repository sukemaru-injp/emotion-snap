'use client';
import { useForm } from '@tanstack/react-form';
import { Button, DatePicker, Form, Input, Modal, Space, message } from 'antd';
import dayjs from 'dayjs';
import { type FC, useCallback, useState, useTransition } from 'react'; // Add useEffect
import { AiOutlinePlus } from 'react-icons/ai';
import { match } from 'ts-pattern';
import { createEvent } from '../_actions/createEvent';

type EventInput = {
	name: string;
	code: string;
	date: Date | null; // Date can be a string or null
};

type Props = {
	userId: string;
	isCreateDisabled?: boolean; // Add optional prop
};
export const CreateEventForm: FC<Props> = ({ userId, isCreateDisabled }) => {
	// Destructure prop
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isSubmitting, start] = useTransition();
	const [messageApi, contextHolder] = message.useMessage();

	const form = useForm<
		EventInput,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined,
		undefined
	>({
		defaultValues: {
			name: '',
			code: '',
			date: null
		},
		onSubmit: ({ value }) => {
			start(async () => {
				const result = await createEvent(
					{
						name: value.name,
						code: value.code,
						date: value.date ? value.date.toISOString() : null
					},
					userId
				);
				match(result)
					.with({ tag: 'success' }, () => {
						messageApi.success('Event created successfully!');
						setIsModalVisible(false);
						form.reset(); // Reset form on success
					})
					.with({ tag: 'failed' }, (_e) => {
						messageApi.error('An unexpected error occurred during submission.');
					})
					.exhaustive();
			});
		}
	});

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
		form.reset(); // Reset form on cancel
	};

	const handleDateChange = useCallback(
		(d: dayjs.Dayjs | undefined) => {
			form.setFieldValue('date', d ? d.toDate() : null);
		},
		[form.setFieldValue]
	);

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
				footer={null} // We'll use the form's submit button
				destroyOnClose // Reset form state when modal closes
			>
				{/* Use form.useStore hook for reactive state if needed outside form.Subscribe */}
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<form.Field
						name="name"
						validators={{
							onChange: ({ value }) =>
								!value ? 'Name is required.' : undefined
						}}
					>
						{(field) => (
							<Form.Item
								label="Name"
								validateStatus={field.state.meta.errors?.length ? 'error' : ''}
								help={
									field.state.meta.errors?.[0] ? (
										<em style={{ color: 'red' }}>
											{field.state.meta.errors[0]}
										</em>
									) : null
								}
								required
							>
								<Input
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Enter event name"
								/>
							</Form.Item>
						)}
					</form.Field>

					<form.Field
						name="code"
						validators={{
							onChange: ({ value }) => {
								if (!value) return 'Code is required.';
								if (value.length < 4)
									return 'Code must be at least 4 characters.';
								if (value.length > 30)
									return 'Code must be 30 characters or less.';
								return undefined;
							}
						}}
					>
						{(field) => (
							<Form.Item
								label="Code"
								validateStatus={field.state.meta.errors?.length ? 'error' : ''}
								help={
									field.state.meta.errors?.[0] ? (
										<em style={{ color: 'red' }}>
											{field.state.meta.errors[0]}
										</em>
									) : null
								}
								required
							>
								<Input
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Enter event code (4-30 chars)"
								/>
							</Form.Item>
						)}
					</form.Field>

					<form.Field name="date">
						{(field) => (
							<Form.Item label="Date (Optional)">
								<DatePicker
									style={{ width: '100%' }}
									name={field.name}
									value={
										field.state.value ? dayjs(field.state.value) : undefined
									}
									onBlur={field.handleBlur}
									onChange={(d) => handleDateChange(d)}
									placeholder="Select date (optional)"
								/>
								{field.state.meta.isValidating ? 'Validating...' : null}
								{field.state.meta.errors?.[0] ? (
									<em style={{ color: 'red' }}>{field.state.meta.errors[0]}</em>
								) : null}
							</Form.Item>
						)}
					</form.Field>

					{/* Buttons */}
					<Form.Item>
						<Space>
							<Button onClick={handleCancel}>Cancel</Button>
							<form.Subscribe
								selector={(state) => [state.canSubmit, state.isSubmitting]}
							>
								{(
									[canSubmit, isSubmittingState] // Correctly receive the array from selector
								) => (
									<Button
										type="primary"
										htmlType="submit"
										disabled={!canSubmit || isSubmittingState || isSubmitting} // Use local isSubmitting state too
										loading={isSubmittingState || isSubmitting} // Use local isSubmitting state too
									>
										Submit
									</Button>
								)}
							</form.Subscribe>
						</Space>
					</Form.Item>
				</form>
			</Modal>
		</>
	);
};
