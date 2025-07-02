'use server';

import type { ServerActionEither } from '@/common/types/ServerActionEither';
import { createClient } from '@/libs/supabase/server';

export type PublishEventFormData = {
	eventId: number;
	eventName: string;
	expire: string;
};

export const publishEvent = async (
	formData: PublishEventFormData,
	userId: string
): Promise<ServerActionEither<Error, { success: true }>> => {
	try {
		const supabase = await createClient();

		// First, verify the user owns the event
		const { data: event, error: eventError } = await supabase
			.from('event')
			.select('id, name, user_id')
			.eq('id', formData.eventId)
			.eq('user_id', userId)
			.single();

		if (eventError || !event) {
			return {
				tag: 'left',
				error: new Error('Event not found or unauthorized')
			};
		}

		// Check if event is already published
		const { data: existingPublic, error: checkError } = await supabase
			.from('public_event')
			.select('event_id')
			.eq('event_id', formData.eventId)
			.single();

		if (checkError && checkError.code !== 'PGRST116') {
			// PGRST116 is "not found" which is expected for new publications
			return {
				tag: 'left',
				error: new Error('Failed to check publication status')
			};
		}

		if (existingPublic) {
			// Update existing publication
			const { error: updateError } = await supabase
				.from('public_event')
				.update({
					event_name: formData.eventName,
					expire: formData.expire,
					updated_at: new Date().toISOString()
				})
				.eq('event_id', formData.eventId);

			if (updateError) {
				return {
					tag: 'left',
					error: new Error('Failed to update event publication')
				};
			}
		} else {
			// Create new publication
			const { error: insertError } = await supabase
				.from('public_event')
				.insert({
					event_id: formData.eventId,
					event_name: formData.eventName,
					expire: formData.expire
				});

			if (insertError) {
				return {
					tag: 'left',
					error: new Error('Failed to publish event')
				};
			}
		}

		return {
			tag: 'right',
			value: { success: true }
		};
	} catch (error) {
		return {
			tag: 'left',
			error: error instanceof Error ? error : new Error('Unknown error')
		};
	}
};

export const unpublishEvent = async (
	eventId: number,
	userId: string
): Promise<ServerActionEither<Error, { success: true }>> => {
	try {
		const supabase = await createClient();

		// First, verify the user owns the event
		const { data: event, error: eventError } = await supabase
			.from('event')
			.select('id, user_id')
			.eq('id', eventId)
			.eq('user_id', userId)
			.single();

		if (eventError || !event) {
			return {
				tag: 'left',
				error: new Error('Event not found or unauthorized')
			};
		}

		// Delete the publication
		const { error: deleteError } = await supabase
			.from('public_event')
			.delete()
			.eq('event_id', eventId);

		if (deleteError) {
			return {
				tag: 'left',
				error: new Error('Failed to unpublish event')
			};
		}

		return {
			tag: 'right',
			value: { success: true }
		};
	} catch (error) {
		return {
			tag: 'left',
			error: error instanceof Error ? error : new Error('Unknown error')
		};
	}
};

export const getPublishedEvent = async (
	eventId: number,
	userId: string
): Promise<
	ServerActionEither<
		Error,
		{ isPublished: boolean; expire?: string; eventName?: string }
	>
> => {
	try {
		const supabase = await createClient();

		// First, verify the user owns the event
		const { data: event, error: eventError } = await supabase
			.from('event')
			.select('id, user_id')
			.eq('id', eventId)
			.eq('user_id', userId)
			.single();

		if (eventError || !event) {
			return {
				tag: 'left',
				error: new Error('Event not found or unauthorized')
			};
		}

		// Check if event is published
		const { data: publicEvent, error: publicError } = await supabase
			.from('public_event')
			.select('expire, event_name')
			.eq('event_id', eventId)
			.single();

		if (publicError && publicError.code !== 'PGRST116') {
			return {
				tag: 'left',
				error: new Error('Failed to check publication status')
			};
		}

		if (publicEvent) {
			return {
				tag: 'right',
				value: {
					isPublished: true,
					expire: publicEvent.expire,
					eventName: publicEvent.event_name
				}
			};
		}

		return {
			tag: 'right',
			value: { isPublished: false }
		};
	} catch (error) {
		return {
			tag: 'left',
			error: error instanceof Error ? error : new Error('Unknown error')
		};
	}
};
