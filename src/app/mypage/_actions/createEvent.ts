'use server';

import type { Database } from '@/../modules/database.types';
import { generateRandomId } from '@/common/utils/generateRandomId';
import { createClient } from '@/libs/supabase/server';
import { type Result, err, ok } from 'neverthrow'; // Use type import for Result

type EventFormData = {
	name: string;
	code: string;
	date?: string | null;
};

// Define the success type and error type for the Result
type CreateEventError = Error;

export async function createEvent(
	formData: EventFormData,
	userId: string
): Promise<Result<null, CreateEventError>> {
	const supabase = await createClient();

	try {
		const generatedId = generateRandomId();

		const eventData: Database['public']['Tables']['event']['Insert'] = {
			id: generatedId,
			user_id: userId,
			name: formData.name,
			code: formData.code,
			date: formData.date || null
		};

		const { error: insertError } = await supabase
			.from('event')
			.insert(eventData);

		if (insertError) {
			return err(new Error(insertError.message));
		}
		return ok(null);
	} catch (e) {
		const error =
			e instanceof Error ? e : new Error('An unknown error occurred.');
		return err(error);
	}
}
