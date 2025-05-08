'use server';
import {
	type ServerActionEither,
	left,
	right
} from '@/common/types/ServerActionEither';
import { createClient } from '@/libs/supabase/server';
import { revalidatePath } from 'next/cache';

// Define the success type and error type for the Result
type DeleteEventError = Error;

export async function deleteEvent(
	eventId: number,
	userId: string
): Promise<ServerActionEither<DeleteEventError, null>> {
	const supabase = await createClient();

	try {
		const { error: deleteError } = await supabase
			.from('event')
			.delete()
			.match({ id: eventId, user_id: userId });

		if (deleteError) {
			return left(new Error(deleteError.message));
		}
		revalidatePath('/mypage');
		return right(null);
	} catch (e) {
		const error =
			e instanceof Error ? e : new Error('An unknown error occurred.');
		return left(error);
	}
}
