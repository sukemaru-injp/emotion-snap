import { ErrorAlert } from '@/common/ui/ErrorAlert';
import { getPublicEvent } from '../_actions/getPublicEvent';
import { Presenter } from './Presenter';

type Props = {
	id: number;
};

export const Container: React.FC<Props> = async ({ id }) => {
	const result = await getPublicEvent(id);

	if (result.tag === 'left') {
		return <ErrorAlert description="Event not found." />;
	}

	const publicEvent = result.value;

	// Check if event is expired
	const now = new Date();
	const expireDate = new Date(publicEvent.expire);
	const isExpired = now > expireDate;

	if (isExpired) {
		return (
			<ErrorAlert
				description="This event has expired and is no longer accepting submissions."
			/>
		);
	}

	return <Presenter publicEvent={publicEvent} />;
};
