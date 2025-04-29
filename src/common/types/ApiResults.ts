import type { Result } from 'neverthrow';

export type ApiResults<SuccessValue, Params = undefined> = (
	p?: Params
) => Promise<Result<SuccessValue, ErrorResult>>;

type ErrorResult = { error: unknown };
