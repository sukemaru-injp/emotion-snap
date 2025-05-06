type Success<T = unknown> = {
	tag: 'success';
	value: T;
};

type Failed<T = unknown> = {
	tag: 'failed';
	error: T;
};

export const success = <T = unknown>(v: T) =>
	({
		tag: 'success',
		value: v
	}) satisfies Success<T>;

export const failed = <T = unknown>(e: T) =>
	({
		tag: 'failed',
		error: e
	}) satisfies Failed<T>;

/**
 * A type that represents the result of a server action.
 */
export type ServerActionResult<T = unknown, E = unknown> =
	| Success<T>
	| Failed<E>;
