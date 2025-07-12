import {
	DeleteObjectsCommand,
	ListObjectsV2Command,
	S3Client
} from '@aws-sdk/client-s3';
import { err, ok, type Result } from 'neverthrow';

const accessKeyId = process.env.AWS_ACCESS_KEY_ID ?? '';
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY ?? '';

const client = new S3Client({
	region: 'ap-northeast-1',
	credentials: {
		accessKeyId,
		secretAccessKey
	}
});

export default client;

export async function deleteObjectsByPrefix(
	eventId: number
): Promise<Result<null, number>> {
	const bucketName = `${process.env.NEXT_PUBLIC_APP_ENV}-emotion-snap-user-photos`;
	const prefix = `/${eventId}/`;

	try {
		const listCommand = new ListObjectsV2Command({
			Bucket: bucketName,
			Prefix: prefix
		});

		const listResponse = await client.send(listCommand);

		if (!listResponse.Contents || listResponse.Contents.length === 0) {
			return ok(null);
		}

		const objects = listResponse.Contents.map((obj) => ({
			Key: obj.Key
		})).filter((obj) => obj.Key);

		if (objects.length === 0) {
			return ok(null);
		}

		const deleteCommand = new DeleteObjectsCommand({
			Bucket: bucketName,
			Delete: {
				Objects: objects
			}
		});

		await client.send(deleteCommand);
		return ok(null);
	} catch (_error) {
		return err(eventId);
	}
}
