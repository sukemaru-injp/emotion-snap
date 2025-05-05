import { createClient } from '@/libs/supabase/server';
import { TopPresenter } from './TopPresenter';

export const TopContainer: React.FC = async () => {
	const supabase = await createClient();

	const { data } = await supabase.auth.getUser();

	return <TopPresenter user={data?.user ?? null} />;
};
