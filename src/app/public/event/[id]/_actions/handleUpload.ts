'use server';

import type { ApiResults } from '@/common/types/ApiResults';
import s3Client from '@/libs/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { err, ok } from 'neverthrow';

export type UploadParam = {
	userName: string;
	eventId: string;
	file: File;
};

export const handleUpload: ApiResults<null, UploadParam> = async (
	params: UploadParam
) => {
	const bucketName = `${process.env.NEXT_PUBLIC_APP_ENV}_emotion_snap_user_photos`;
	const key = `${params.userName}/${params.eventId}/${params.file.name}`;

	try {
		const fileBuffer = await params.file.arrayBuffer();
		const command = new PutObjectCommand({
			Bucket: bucketName,
			Key: key,
			Body: Buffer.from(fileBuffer),
			ContentType: params.file.type
		});

		await s3Client.send(command);
		return ok(null);
	} catch (error) {
		console.error('Error uploading to S3:', error);
		return err({ error });
	}
};
