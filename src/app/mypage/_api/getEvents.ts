import { err, ok } from 'neverthrow';
import type { ApiResults } from '@/common/types/ApiResults';
import type { Event } from '@/common/types/Event';
import { createClient } from '@/libs/supabase/server';

export const getEvents: ApiResults<
	readonly Event[],
	{ userId: string }
> = async ({ userId }) => {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from('event')
		.select('*')
		.eq('user_id', userId);

	if (error) {
		return err({ error });
	}

	return ok(
		data.map(
			(event) =>
				({
					id: event.id,
					code: event.code,
					createdAt: event.created_at,
					date: event.date,
					name: event.name
				}) satisfies Event
		)
	);
};
