import { ErrorAlert } from '@/common/ui/ErrorAlert';
import type React from 'react';
import { getEvent } from '../../../../_api/getEvent';
import { ImagesContainer } from './ImagesContainer';
import { Presenter } from './Presenter';

type ContainerProps = {
	eventId: number;
	userId: string;
};

export const Container: React.FC<ContainerProps> = async ({
	eventId,
	userId
}) => {
	const [eventResult] = await Promise.all([getEvent({ id: eventId })]);

	if (eventResult.isErr()) {
		return <ErrorAlert description="Event not found" />;
	}

	const event = eventResult.value;
	return (
		<>
			<Presenter event={event} usrId={userId} />
			<ImagesContainer eventId={eventId} />
		</>
	);
};
