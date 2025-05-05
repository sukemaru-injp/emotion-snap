import { getEvent } from '@/app/_api/getEvent';
import { ErrorAlert } from '@/common/ui/ErrorAlert';
import { Presenter } from './Presenter';

type Props = {
	id: number;
};

export const Container: React.FC<Props> = async ({ id }) => {
	const result = await getEvent({ id });

	if (result.isErr()) {
		return <ErrorAlert description="Failed to load event data." />;
	}

	return <Presenter event={result.value} />;
};
