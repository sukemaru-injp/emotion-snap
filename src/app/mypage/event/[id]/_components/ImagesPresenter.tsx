import type { EventImage } from '../types/EventImage';
import type { S3ObjectInfo } from '../types/S3ObjectInfo';

export type Props = {
	images: EventImage[];
	objects: S3ObjectInfo[];
};

export const ImagesPresenter: React.FC<Props> = ({ images, objects }) => {
	return (
		<div>
			images: {images.length}, objects: {objects.length}
		</div>
	);
};
