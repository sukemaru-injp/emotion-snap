import { ErrorAlert } from '@/common/ui/ErrorAlert';
import type React from 'react';
import { getEvent } from '../../../../_api/getEvent';
import { Presenter } from './Presenter';
import { getObjects } from '../_api/getObjects';
import { match } from 'ts-pattern';

type ContainerProps = {
	eventId: number;
	userId: string;
};

export const Container: React.FC<ContainerProps> = async ({
	eventId,
	userId
}) => {
	const [eventResult, objectsResult] = await Promise.all([
		getEvent({ id: eventId }),
		getObjects(eventId.toString())
	]);

	if (eventResult.isErr()) {
		return <ErrorAlert description="Event not found" />;
	}

	const event = eventResult.value;
	return (
		<Presenter
			event={event}
			usrId={userId}
			s3Objects={match(objectsResult)
				.with({ tag: 'right' }, ({ value }) => value)
				.with({ tag: 'left' }, () => [])
				.exhaustive()}
		/>
	);
};
