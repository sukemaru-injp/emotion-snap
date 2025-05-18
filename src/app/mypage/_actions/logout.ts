'use server';

import { createClient } from '@/libs/supabase/server';
import { redirect } from 'next/navigation';

export const logout = async (): Promise<void> => {
	const supabase = await createClient();
	const { error } = await supabase.auth.signOut();

	if (error) {
		// In a real application, you might want to throw an error
		// or return an object indicating failure.
		// For now, we'll log it and redirect, as per the plan.
		console.error('Error logging out:', error);
		throw new Error('Logout failed');
	}
	redirect('/');
};
