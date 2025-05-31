'use server';
import {
	type ServerActionEither,
	left,
	right
} from '@/common/types/ServerActionEither';
import { createClient } from '@/libs/supabase/server';

export type UpdateEventFormData = {
	id: number;
	name: string;
	code: string;
	date?: string | null;
};

// Define the success type and error type for the Result
type CreateEventError = Error;

export async function editEvent(
	formData: UpdateEventFormData,
	userId: string
): Promise<ServerActionEither<CreateEventError, null>> {
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
			return left(new Error(error.message));
		}
		return right(null);
	} catch (e) {
		const error =
			e instanceof Error ? e : new Error('An unknown error occurred.');
		return left(error);
	}
}
