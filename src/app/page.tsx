import { type JSX, Suspense } from 'react';
import { TopContainer } from './_components/TopContainer';

export default function Home(): JSX.Element {
	return (
		<Suspense fallback={null}>
			<TopContainer />
		</Suspense>
	);
}
