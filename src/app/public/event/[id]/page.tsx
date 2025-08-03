import { ErrorAlert } from '@/common/ui/ErrorAlert';
import { Container } from './_components/Container';

export default async function Page({
	params,
	searchParams
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const { id: maybeId } = await params;
	const searchParamsResolved = await searchParams;

	const id = Number.parseInt(maybeId, 10);

	if (Number.isNaN(id)) {
		return <ErrorAlert description="Invalid event ID" />;
	}

	const isCompleted = searchParamsResolved.isCompleted === 'true';

	return <Container id={id} isCompleted={isCompleted} />;
}
