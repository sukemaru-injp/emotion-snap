import { Alert } from 'antd';
import type { JSX } from 'react';
import { getEvents } from '../_api/getEvents';
import { Presenter } from './Presenter';

export const Container = async (): Promise<JSX.Element> => {
	const result = await getEvents();

	if (result.isErr()) {
		console.error(result.error); // Log the error for debugging
		return (
			<Alert
				message="Error"
				description="Failed to load events. Please try again later."
				type="error"
				showIcon
			/>
		);
	}

	const events = result.value;

	return <Presenter events={events} />;
};
