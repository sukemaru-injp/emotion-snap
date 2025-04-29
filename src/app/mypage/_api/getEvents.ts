import type { ApiResults } from '@/common/types/ApiResults';
import type { Event } from '@/common/types/Event';
import { createClient } from '@/libs/supabase/server';
import { err, ok } from 'neverthrow';

export const getEvents: ApiResults<readonly Event[]> = async () => {
	const supabase = await createClient();

	const { data: userData } = await supabase.auth.getUser();

	if (userData.user === null) {
		return err({ error: new Error('User not authenticated') });
	}

	const { data, error } = await supabase
		.from('event')
		.select('*')
		.eq('user_id', userData.user.id);

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
