type Right<T = unknown> = {
	tag: 'right';
	value: T;
};

type Left<T = unknown> = {
	tag: 'left';
	error: T;
};

export const right = <T = unknown>(v: T) =>
	({
		tag: 'right',
		value: v
	}) satisfies Right<T>;

export const left = <T = unknown>(e: T) =>
	({
		tag: 'left',
		error: e
	}) satisfies Left<T>;

/**
 * A type that represents the result of a server action.
 * It can either be a success (Right) or a failure (Left).
 * ServerAction用に、シリアライザブルなデータ型を提供する
 *
 */
export type ServerActionEither<E = unknown, T = unknown> = Right<T> | Left<E>;
