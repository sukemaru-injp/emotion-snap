'use server';
import {
	type ServerActionResult,
	failed,
	success
} from '@/common/types/ServerActionResult';
import { createClient } from '@/libs/supabase/server';
type EventFormData = {
	id: number;
	name: string;
	code: string;
	date?: string | null;
};

// Define the success type and error type for the Result
type CreateEventError = Error;

export async function editEvent(
	formData: EventFormData,
	userId: string
): Promise<ServerActionResult<null, CreateEventError>> {
	const supabase = await createClient();

	try {
		const { error } = await supabase
			.from('event')
			.update({
				name: formData.name,
				code: formData.code,
				date: formData.date || null,
				updated_at: new Date().toDateString()
			})
			.eq('user_id', userId)
			.eq('id', formData.id);

		if (error) {
			return failed(new Error(error.message));
		}
		return success(null);
	} catch (e) {
		const error =
			e instanceof Error ? e : new Error('An unknown error occurred.');
		return failed(error);
	}
}
