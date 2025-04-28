import { Suspense } from 'react';
import { CheckAuth } from '../_components/CheckAuth';
import { Container } from './_components/Container';

export default async function MyPage() {
	return (
		<CheckAuth
			render={(_u) => {
				// Mark user as unused if not needed
				return (
					<Suspense fallback={<>Loading...</>}>
						<Container />
					</Suspense>
				);
			}}
		/>
	);
}
