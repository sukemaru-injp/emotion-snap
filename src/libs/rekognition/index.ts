import {
	DetectFacesCommand,
	RekognitionClient
} from '@aws-sdk/client-rekognition';

const REGION = 'ap-northeast-1' as const;

const accessKeyId = process.env.AWS_ACCESS_KEY_ID ?? '';
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY ?? '';

const rekognitionClient = new RekognitionClient({
	region: REGION,
	credentials: {
		accessKeyId,
		secretAccessKey
	}
});

export { rekognitionClient, DetectFacesCommand };
