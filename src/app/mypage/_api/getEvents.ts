import { createClient } from '@/libs/supabase/server';
import { ok, err } from 'neverthrow';
import type { Event } from '@/common/types/Event';
import type { ApiResults } from '@/common/types/ApiResults';

export const getEvents: ApiResults<readonly Event[]> = async () => {
	const supabase = await createClient();

	const { data, error } = await supabase.from('event').select('*');

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
