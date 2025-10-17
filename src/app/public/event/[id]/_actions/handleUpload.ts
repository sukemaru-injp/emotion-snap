'use server';
import type { Emotion, Smile } from '@aws-sdk/client-rekognition';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { format } from 'date-fns';
import {
	left,
	right,
	type ServerActionEither
} from '@/common/types/ServerActionEither';
import { generateRandomId } from '@/common/utils/generateRandomId';
import { roundToFourDecimals } from '@/common/utils/roundToFourDecimals';
import { DetectFacesCommand, rekognitionClient } from '@/libs/rekognition';
import s3Client from '@/libs/s3';
import { createClient } from '@/libs/supabase/server';
import type { TablesInsert } from '@/libs/supabase/types';

const checkScore = (score: number): number => (score < 1 ? 1 : score);

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
	const key = `/${params.eventId}/${params.userName}${format(new Date(), 'yyyyMMddHHmmss')}-${params.file.name}`;

	try {
		console.log(`Uploading file to S3 with key:${key},${bucketName}`);
		const fileBuffer = await params.file.arrayBuffer();
		console.log(`File buffer created for:${key}`);
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

		// Save to Supabase
		try {
			const supabase = await createClient();

			// Extract emotion scores
			const happyEmotion = emotions.find((e) => e.Type === 'HAPPY');
			const angryEmotion = emotions.find((e) => e.Type === 'ANGRY');
			const sadEmotion = emotions.find((e) => e.Type === 'SAD');
			const surprisedEmotion = emotions.find((e) => e.Type === 'SURPRISED');

			// Prepare data for insertion
			const eventImageData: TablesInsert<'event_image'> = {
				id: generateRandomId(),
				event_id: Number.parseInt(params.eventId, 10),
				s3_key: key,
				user_name: params.userName,
				happy_score: happyEmotion?.Confidence
					? checkScore(roundToFourDecimals(happyEmotion.Confidence))
					: 1,
				angry_score: angryEmotion?.Confidence
					? checkScore(roundToFourDecimals(angryEmotion.Confidence))
					: 1,
				sad_score: sadEmotion?.Confidence
					? checkScore(roundToFourDecimals(sadEmotion.Confidence))
					: 1,
				surprised_score: surprisedEmotion?.Confidence
					? checkScore(roundToFourDecimals(surprisedEmotion.Confidence))
					: 1,
				smile_score: smile.Confidence
					? checkScore(roundToFourDecimals(smile.Confidence))
					: 1
			};

			console.info('Event image data to insert:', eventImageData);

			// Insert into event_image table
			const { error: insertError } = await supabase
				.from('event_image')
				.insert(eventImageData);

			if (insertError) {
				console.error('Error saving to Supabase:', insertError);
				return left(
					`データベースへの保存に失敗しました: ${insertError.message}`
				);
			}

			return right({
				emotions,
				smile
			});
		} catch (dbError) {
			console.error('Error with database operation:', dbError);
			return left(
				`データベース操作に失敗しました: ${dbError instanceof Error ? dbError.message : '不明なエラー'}`
			);
		}
	} catch (error) {
		console.error('Error uploading to S3:', error);
		return left(
			`S3へのアップロードに失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`
		);
	}
};
