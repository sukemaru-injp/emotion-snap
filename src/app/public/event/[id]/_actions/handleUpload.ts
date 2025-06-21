'use server';
import {
	type ServerActionEither,
	right,
	left
} from '@/common/types/ServerActionEither';
import s3Client from '@/libs/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export type UploadParam = {
	userName: string;
	eventId: string;
	file: File;
};

export const handleUpload = async (
	params: UploadParam
): Promise<ServerActionEither<string, null>> => {
	const bucketName = `${process.env.NEXT_PUBLIC_APP_ENV}-emotion-snap-user-photos`;
	const key = `/${params.eventId}/${params.userName}-${params.file.name}`;

	try {
		const fileBuffer = await params.file.arrayBuffer();
		const command = new PutObjectCommand({
			Bucket: bucketName,
			Key: key,
			Body: Buffer.from(fileBuffer),
			ContentType: params.file.type
		});

		const res = await s3Client.send(command);
		console.log('S3 upload response:', res);

		return right(null);
	} catch (error) {
		console.error('Error uploading to S3:', error);
		return left(
			`S3へのアップロードに失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`
		);
	}
};
