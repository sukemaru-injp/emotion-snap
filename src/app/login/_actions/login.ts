'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/libs/supabase/server';

export const loginWithGoogle = async (): Promise<void> => {
	const requestHeaders = await headers();
	const origin = requestHeaders.get('origin');
	const supabase = await createClient();

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: 'google',
		options: {
			redirectTo: `${origin}/auth/callback`
		}
	});

	if (error) {
		// eslint-disable-next-line no-console
		console.error('Error during Google login:', error);
		return redirect('/login?error=OAuthSignin');
	}

	if (data.url) {
		return redirect(data.url); // Redirect the user to the Google authentication page
	}

	// Fallback redirect if no URL is present (should not happen in normal flow)
	return redirect('/login?error=UnknownOAuthError');
};
