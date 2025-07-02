import { ErrorAlert } from '@/common/ui/ErrorAlert';
import type React from 'react';
import { getEvent } from '../../../../_api/getEvent';
import { getPublishedEvent } from '../_actions/publishEvent';
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
	const [eventResult, publishResult] = await Promise.all([
		getEvent({ id: eventId }),
		getPublishedEvent(eventId, userId)
	]);

	if (eventResult.isErr()) {
		return <ErrorAlert description="Event not found" />;
	}

	const event = eventResult.value;
	const publishData =
		publishResult.tag === 'right'
			? publishResult.value
			: { isPublished: false };

	return (
		<>
			<Presenter
				event={event}
				usrId={userId}
				initialPublishData={publishData}
			/>
			<ImagesContainer eventId={eventId} />
		</>
	);
};
