'use server';
import {
	type ServerActionEither,
	left,
	right
} from '@/common/types/ServerActionEither';
import { DetectFacesCommand, rekognitionClient } from '@/libs/rekognition';
import s3Client from '@/libs/s3';
import type { Emotion, Smile } from '@aws-sdk/client-rekognition';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export type UploadParam = {
	userName: string;
	eventId: string;
	file: File;
};

export type RekognitionResult = {
	emotions: Emotion[];
	smile: Smile;
};

export const handleUpload = async (
	params: UploadParam
): Promise<ServerActionEither<string, RekognitionResult>> => {
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
		console.info('S3 uploaded:', JSON.stringify(res));

		const detectFacesCommand = new DetectFacesCommand({
			Image: {
				S3Object: {
					Bucket: bucketName,
					Name: key
				}
			},
			Attributes: ['EMOTIONS', 'SMILE']
		});

		const rekognitionResponse =
			await rekognitionClient.send(detectFacesCommand);

		console.info('Rekognition response:', rekognitionResponse);

		if (
			!rekognitionResponse.FaceDetails ||
			rekognitionResponse.FaceDetails.length === 0
		) {
			return left('顔が検出できませんでした。');
		}

		const faceDetails = rekognitionResponse.FaceDetails[0];
		const emotions = faceDetails.Emotions;
		const smile = faceDetails.Smile;

		if (!emotions || !smile) {
			return left('感情・笑顔が検出できませんでした。');
		}

		return right({
			emotions,
			smile
		});
	} catch (error) {
		console.error('Error uploading to S3:', error);
		return left(
			`S3へのアップロードに失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`
		);
	}
};
