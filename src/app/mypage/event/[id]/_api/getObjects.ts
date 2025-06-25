'use server';

import {
	type ServerActionEither,
	left,
	right
} from '@/common/types/ServerActionEither';
import s3Client from '@/libs/s3';
import { GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { S3ObjectInfo } from '../types/S3ObjectInfo';

export const getObjects = async (
	eventId: string
): Promise<ServerActionEither<string, readonly S3ObjectInfo[]>> => {
	const bucketName = `${process.env.NEXT_PUBLIC_APP_ENV}-emotion-snap-user-photos`;

	try {
		// List objects in the bucket
		const listCommand = new ListObjectsV2Command({
			Bucket: bucketName,
			Prefix: `/${eventId}/`
		});

		const listResponse = await s3Client.send(listCommand);

		if (!listResponse.Contents || listResponse.Contents.length === 0) {
			return right([]);
		}

		// Generate signed URLs and create info objects for each S3 object
		const objectInfosPromises = listResponse.Contents.map(
			async (object): Promise<S3ObjectInfo | null> => {
				if (!object.Key) {
					return null;
				}

				const getCommand = new GetObjectCommand({
					Bucket: bucketName,
					Key: object.Key
				});

				// Generate a signed URL that expires in 1 hour
				const url: string = await getSignedUrl(s3Client, getCommand, {
					expiresIn: 3600
				});

				// Extract the filename from the key
				// The key format is "/{eventId}/{userName}-{filename}"
				const keyParts = object.Key.split('/');
				const fileName = keyParts[keyParts.length - 1];

				return {
					url,
					key: object.Key,
					lastModified: object.LastModified,
					size: object.Size,
					name: fileName
				};
			}
		);

		const resolvedObjectInfos = await Promise.all(objectInfosPromises);

		const validObjectInfos = resolvedObjectInfos.filter(
			(info): info is S3ObjectInfo => info !== null
		);

		return right(validObjectInfos);
	} catch (error) {
		console.error('Error getting objects from S3:', error);
		return left('S3からのオブジェクト取得に失敗しました');
	}
};
