import { ErrorAlert } from '@/common/ui/ErrorAlert';
import type { JSX } from 'react';
import { getEvents } from '../_api/getEvents';
import { Presenter } from './Presenter';

type Props = {
	userId: string;
};
export const Container = async (p: Props): Promise<JSX.Element> => {
	const result = await getEvents({ userId: p.userId });

	if (result.isErr()) {
		return (
			<ErrorAlert description="Failed to load events. Please try again later." />
		);
	}

	const events = result.value;
	return <Presenter events={events} userId={p.userId} />;
};
