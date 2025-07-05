import { err, ok } from 'neverthrow';
import type { ApiResults } from '@/common/types/ApiResults';
import { createClient } from '@/libs/supabase/server';
import type { EventImage } from '../types/EventImage';

export const getEventImages: ApiResults<
	EventImage[],
	{ eventId: number }
> = async ({ eventId }) => {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from('event_image')
		.select('*')
		.eq('event_id', eventId);

	if (error) {
		return err({ error });
	}

	const eventImages: EventImage[] = data.map((item) => ({
		id: item.id,
		s3_key: item.s3_key,
		angry_score: item.angry_score,
		happy_score: item.happy_score,
		sad_score: item.sad_score,
		smile_score: item.smile_score,
		surprised_score: item.surprised_score,
		user_name: item.user_name
	}));

	return ok(eventImages);
};
