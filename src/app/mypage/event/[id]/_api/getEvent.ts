import type { ApiResults } from '@/common/types/ApiResults';
import type { Event } from '@/common/types/Event';
import { createClient } from '@/libs/supabase/server';
import { err, ok } from 'neverthrow';

export const getEvent: ApiResults<Event, { id: number }> = async ({ id }) => {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from('event')
		.select('*')
		.eq('id', id)
		.single();

	if (error) {
		return err({ error });
	}

	if (!data) {
		return err({ error: new Error('Event not found') });
	}
	return ok<Event>({
		id: data.id,
		code: data.code,
		createdAt: data.created_at,
		date: data.date,
		name: data.name
	} satisfies Event);
};
