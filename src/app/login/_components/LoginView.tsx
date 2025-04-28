'use client';
import { ThemeProvider } from '@/app/_components/ThemeProvider';
import client from '@/libs/supabase/client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Card } from 'antd';
import type { FC } from 'react';

export const LoginView: FC = () => {
	return (
		<ThemeProvider>
			<div style={{ display: 'grid', placeContent: 'center', height: '100vh' }}>
				<Card title="ログイン" style={{ width: '100%' }}>
					<Auth
						supabaseClient={client}
						appearance={{ theme: ThemeSupa }}
						providers={['google']}
						onlyThirdPartyProviders
						queryParams={{
							access_type: 'offline',
							prompt: 'consent'
						}}
					/>
				</Card>
			</div>
		</ThemeProvider>
	);
};
