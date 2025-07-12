'use server';
import { revalidatePath } from 'next/cache';
import {
	left,
	right,
	type ServerActionEither
} from '@/common/types/ServerActionEither';
import { deleteObjectsByPrefix } from '@/libs/s3';
import { createClient } from '@/libs/supabase/server';

// Define the success type and error type for the Result
type DeleteEventError = Error;

export async function deleteEvent(
	eventId: number,
	userId: string
): Promise<ServerActionEither<DeleteEventError, null>> {
	const supabase = await createClient();

	const res = await deleteObjectsByPrefix(eventId);
	if (res.isErr()) {
		console.warn(`S3 deletion failed for event ${eventId}`);
	}
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
