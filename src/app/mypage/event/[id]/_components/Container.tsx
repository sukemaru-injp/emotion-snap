import { ErrorAlert } from '@/common/ui/ErrorAlert';
import type React from 'react';
import { getEvent } from '../../../../_api/getEvent';
import { Presenter } from './Presenter';

type ContainerProps = {
	eventId: number;
	userId: string;
};

export const Container: React.FC<ContainerProps> = async ({
	eventId,
	userId
}) => {
	const result = await getEvent({ id: eventId });

	if (result.isErr()) {
		return <ErrorAlert description="Event not found" />;
	}

	const event = result.value;
	return <Presenter event={event} usrId={userId} />;
};
