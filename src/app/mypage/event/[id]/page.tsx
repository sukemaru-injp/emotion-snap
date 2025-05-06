import { CheckAuth } from '@/app/_components/CheckAuth';
import { ErrorAlert } from '@/common/ui/ErrorAlert';
import { Container } from './_components/Container';

export default async function Page({ params }: { params: { id: string } }) {
	const { id: maybeId } = await params;

	const id = Number.parseInt(maybeId, 10);

	if (Number.isNaN(id)) {
		return <ErrorAlert description="Invalid event ID" />;
	}

	return (
		<CheckAuth
			render={(u) => {
				return <Container eventId={id} userId={u.id} />;
			}}
		/>
	);
}
