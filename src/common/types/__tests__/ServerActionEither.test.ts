import { describe, expect, it } from 'vitest';
import { left, right } from '../ServerActionEither';

describe('right', () => {
	it('should return a success object with the given string value', () => {
		const result = right('test value');
		expect(result).toEqual({
			tag: 'right',
			value: 'test value'
		});
	});

	it('should return a success object with the given number value', () => {
		const result = right(123);
		expect(result).toEqual({
			tag: 'right',
			value: 123
		});
	});

	it('should return a success object with the given object value', () => {
		const obj = { id: 1, data: 'sample' };
		const result = right(obj);
		expect(result).toEqual({
			tag: 'right',
			value: obj
		});
	});

	it('should return a success object with a null value', () => {
		const result = right(null);
		expect(result).toEqual({
			tag: 'right',
			value: null
		});
	});

	it('should return a success object with an undefined value', () => {
		const result = right(undefined);
		expect(result).toEqual({
			tag: 'right',
			value: undefined
		});
	});
});

describe('left', () => {
	it('should return a failed object with the given Error object', () => {
		const err = new Error('Test error');
		const result = left(err);
		expect(result).toEqual({
			tag: 'left',
			error: err
		});
	});

	it('should return a failed object with the given string error message', () => {
		const result = left('A simple error message');
		expect(result).toEqual({
			tag: 'left',
			error: 'A simple error message'
		});
	});

	it('should return a failed object with a custom error object', () => {
		const customError = { code: 500, message: 'Server Issue' };
		const result = left(customError);
		expect(result).toEqual({
			tag: 'left',
			error: customError
		});
	});
});
