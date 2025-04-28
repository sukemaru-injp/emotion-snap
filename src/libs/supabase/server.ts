'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { SupabaseDatabase } from './types';

// https://supabase.com/docs/guides/auth/server-side/nextjs
export async function createClient() {
	const cookieStore = await cookies();

	const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
	const key = process.env.NEXT_PUBLIC_SUPABASE_API_KEY ?? '';

	if (!url || !key) {
		throw new Error('Missing Supabase URL or Key');
	}

	return createServerClient<SupabaseDatabase>(url, key, {
		cookies: {
			getAll() {
				return cookieStore.getAll();
			},
			setAll(cookiesToSet) {
				try {
					for (const cookie of cookiesToSet) {
						const { name, value, options } = cookie;
						cookieStore.set(name, value, options);
					}
				} catch (e: unknown) {
					// The `setAll` method was called from a Server Component.
					// This can be ignored if you have middleware refreshing
					// user sessions.
					console.error(e);
				}
			}
		}
	});
}
