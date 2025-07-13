'use client';
import { Button, Card } from 'antd';
import { type FC, useCallback, useTransition } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { loginWithGoogle } from '../_actions/login';

export const LoginView: FC = () => {
	const [isPending, startTransition] = useTransition();

	const handleGoogleLogin = useCallback(() => {
		startTransition(async () => {
			await loginWithGoogle();
		});
	}, []);

	return (
		<div style={{ display: 'grid', placeContent: 'center', height: '100vh' }}>
			<Card title="ログイン" style={{ width: 300 }}>
				<form action={handleGoogleLogin}>
					<Button
						type="primary"
						icon={<FaGoogle />}
						disabled={isPending}
						htmlType="submit"
						block
					>
						Googleでログイン
					</Button>
				</form>
			</Card>
		</div>
	);
};
