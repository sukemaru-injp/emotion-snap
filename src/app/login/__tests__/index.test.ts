import { expect, test } from 'vitest';

test('first test', () => {
	const add = (a: number, b: number) => a + b;
	expect(add(1, 1)).toStrictEqual(2);
});
