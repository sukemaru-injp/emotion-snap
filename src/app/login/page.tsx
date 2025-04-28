import { createClient } from '@/libs/supabase/server';
import type { JSX } from 'react';
import { LoginView } from './_components/LoginView';

export default async function Login(): Promise<JSX.Element> {
	const supabase = await createClient();

	const { data, error } = await supabase.auth.getUser();

	if (error || !data?.user) {
		return <LoginView />;
	}

	return (
		<>
			<p>ログインしています。</p>
		</>
	);
}
