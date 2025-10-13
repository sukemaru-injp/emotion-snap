// The client you created from the Server-Side Auth instructions

import { NextResponse } from 'next/server';
import { createClient } from '@/libs/supabase/server';

export async function GET(request: Request) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get('code');
	// if "next" is in param, use it as the redirect URL
	const next = searchParams.get('next') ?? '/';

	if (code) {
		const supabase = await createClient();
		const { error } = await supabase.auth.exchangeCodeForSession(code);

		if (!error) {
			console.log(
				'Successfully exchanged code for session:',
				`${origin}${next}`
			);
			// Always redirect back to the same origin that initiated the flow
			return NextResponse.redirect(`${origin}${next}`);
		}
	}

	// return the user to an error page with instructions
	return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
