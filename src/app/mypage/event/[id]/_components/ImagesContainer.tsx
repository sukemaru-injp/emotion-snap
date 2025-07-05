import { type JSX, Suspense } from 'react';
import { match } from 'ts-pattern';
import { Loader } from '@/common/ui/Loader';
import { getEventImages } from '../_api/getEventImages';
import { getObjects } from '../_api/getObjects';
import { ImagesPresenter } from './ImagesPresenter';

type Props = {
	eventId: number;
};
export const ImagesContainer = async (p: Props): Promise<JSX.Element> => {
	const [objectsResult, eventImagesResult] = await Promise.all([
		getObjects(p.eventId.toString()),
		getEventImages({ eventId: p.eventId })
	]);

	return (
		<Suspense fallback={<Loader />}>
			<ImagesPresenter
				images={eventImagesResult.match(
					(v) => v,
					() => []
				)}
				objects={match(objectsResult)
					.with({ tag: 'right' }, ({ value }) => [...value])
					.with({ tag: 'left' }, () => [])
					.exhaustive()}
			/>
		</Suspense>
	);
};
