import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export async function updateSession(request: NextRequest) {
	let supabaseResponse = NextResponse.next({
		request
	});

	const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
	const key = process.env.NEXT_PUBLIC_SUPABASE_API_KEY ?? '';

	if (!url || !key) {
		throw new Error('Missing Supabase URL or Key');
	}

	const supabase = createServerClient(url, key, {
		cookies: {
			getAll() {
				return request.cookies.getAll();
			},
			setAll(cookiesToSet) {
				for (const cookie of cookiesToSet) {
					const { name, value } = cookie;
					request.cookies.set(name, value);
				}

				supabaseResponse = NextResponse.next({
					request
				});

				for (const cookie of cookiesToSet) {
					const { name, value, options } = cookie;
					supabaseResponse.cookies.set(name, value, options);
				}
			}
		}
	});

	const {
		data: { user }
	} = await supabase.auth.getUser();
	if (
		request.nextUrl.pathname.startsWith('/public') ||
		request.nextUrl.pathname === '/'
	) {
		return supabaseResponse;
	}

	if (
		!user &&
		!request.nextUrl.pathname.startsWith('/login') &&
		!request.nextUrl.pathname.startsWith('/auth')
	) {
		// no user, potentially respond by redirecting the user to the login page
		const url = request.nextUrl.clone();
		url.pathname = '/login';
		return NextResponse.redirect(url);
	}

	// IMPORTANT: Avoid writing any logic between createServerClient and
	// supabase.auth.getUser(). A simple mistake could make it very hard to debug
	// issues with users being randomly logged out.

	// IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
	// creating a new response object with NextResponse.next() make sure to:
	// 1. Pass the request in it, like so:
	//    const myNewResponse = NextResponse.next({ request })
	// 2. Copy over the cookies, like so:
	//    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
	// 3. Change the myNewResponse object to fit your needs, but avoid changing
	//    the cookies!
	// 4. Finally:
	//    return myNewResponse
	// If this is not done, you may be causing the browser and server to go out
	// of sync and terminate the user's session prematurely!

	return supabaseResponse;
}
