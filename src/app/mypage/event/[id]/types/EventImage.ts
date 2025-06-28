export type EventImage = {
	id: number;
	s3_key: string;
	angry_score: number | null;
	happy_score: number | null;
	sad_score: number | null;
	smile_score: number | null;
	surprised_score: number | null;
	user_name: string | null;
};
