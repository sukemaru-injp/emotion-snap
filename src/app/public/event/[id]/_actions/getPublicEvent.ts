'use server';

import type { ServerActionEither } from '@/common/types/ServerActionEither';
import { createClient } from '@/libs/supabase/server';

export type PublicEventData = {
	event_id: number;
	event_name: string;
	expire: string;
	created_at: string;
	updated_at: string;
};

export const getPublicEvent = async (
	eventId: number
): Promise<ServerActionEither<Error, PublicEventData>> => {
	try {
		const supabase = await createClient();

		const { data: publicEvent, error: publicError } = await supabase
			.from('public_event')
			.select('*')
			.eq('event_id', eventId)
			.single();

		if (publicError) {
			return {
				tag: 'left',
				error: new Error('Event not found')
			};
		}

		return {
			tag: 'right',
			value: publicEvent
		};
	} catch (error) {
		return {
			tag: 'left',
			error: error instanceof Error ? error : new Error('Unknown error')
		};
	}
};
