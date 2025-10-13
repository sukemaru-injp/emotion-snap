'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/libs/supabase/server';

export const loginWithGoogle = async (): Promise<void> => {
	const requestHeaders = await headers();
	// Build origin from forwarded headers/host to ensure host consistency
	const protocol = requestHeaders.get('x-forwarded-proto') ?? 'http';
	const host =
		requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host') ?? '';
	const baseUrl = `${protocol}://${host}`;
	console.log('Using request origin for redirect:', baseUrl);

	const supabase = await createClient();

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: 'google',
		options: {
			redirectTo: `${baseUrl}/auth/callback`
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
