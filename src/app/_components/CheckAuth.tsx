import type { User } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { createClient } from '@/libs/supabase/server';

type Props = {
	render: (user: User) => ReactNode;
};

export const CheckAuth = async ({ render }: Props) => {
	const supabase = await createClient();

	const { data, error } = await supabase.auth.getUser();

	if (error || !data?.user) {
		redirect('/login');
	}

	return <>{render(data.user)}</>;
};
