import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseDatabase } from './types';

function createClient() {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
	const key = process.env.NEXT_PUBLIC_SUPABASE_API_KEY ?? '';
	if (!url || !key) {
		throw new Error('Missing Supabase URL or Key');
	}

	return createBrowserClient<SupabaseDatabase>(url, key);
}

export default createClient();
