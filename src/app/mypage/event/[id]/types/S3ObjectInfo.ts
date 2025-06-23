export type S3ObjectInfo = {
	url: string;
	key: string;
	lastModified?: Date;
	size?: number;
	name?: string; // Extracted from the key
};
