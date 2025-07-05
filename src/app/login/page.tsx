import { redirect } from 'next/navigation';
import type { JSX } from 'react';
import { createClient } from '@/libs/supabase/server';
import { LoginView } from './_components/LoginView';

export default async function Login(): Promise<JSX.Element> {
	const supabase = await createClient();

	const { data } = await supabase.auth.getUser();

	if (data.user !== null) {
		redirect('/mypage');
	}

	return <LoginView />;
}
