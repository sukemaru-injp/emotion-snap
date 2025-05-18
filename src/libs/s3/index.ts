import { S3Client } from '@aws-sdk/client-s3';

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
