import { Suspense } from 'react';
import { CheckAuth } from '../_components/CheckAuth';
import { Container } from './_components/Container';

export default async function MyPage() {
	return (
		<CheckAuth
			render={(u) => {
				return (
					<Suspense fallback={<>Loading...</>}>
						<Container userId={u.id} />
					</Suspense>
				);
			}}
		/>
	);
}
