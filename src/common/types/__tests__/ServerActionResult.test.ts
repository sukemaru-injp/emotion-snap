import { describe, expect, it } from 'vitest';
import { failed, success } from '../ServerActionResult';

describe('success', () => {
	it('should return a success object with the given string value', () => {
		const result = success('test value');
		expect(result).toEqual({
			tag: 'success',
			value: 'test value'
		});
	});

	it('should return a success object with the given number value', () => {
		const result = success(123);
		expect(result).toEqual({
			tag: 'success',
			value: 123
		});
	});

	it('should return a success object with the given object value', () => {
		const obj = { id: 1, data: 'sample' };
		const result = success(obj);
		expect(result).toEqual({
			tag: 'success',
			value: obj
		});
	});

	it('should return a success object with a null value', () => {
		const result = success(null);
		expect(result).toEqual({
			tag: 'success',
			value: null
		});
	});

	it('should return a success object with an undefined value', () => {
		const result = success(undefined);
		expect(result).toEqual({
			tag: 'success',
			value: undefined
		});
	});
});

describe('failed', () => {
	it('should return a failed object with the given Error object', () => {
		const err = new Error('Test error');
		const result = failed(err);
		expect(result).toEqual({
			tag: 'failed',
			error: err
		});
	});

	it('should return a failed object with the given string error message', () => {
		const result = failed('A simple error message');
		expect(result).toEqual({
			tag: 'failed',
			error: 'A simple error message'
		});
	});

	it('should return a failed object with a custom error object', () => {
		const customError = { code: 500, message: 'Server Issue' };
		const result = failed(customError);
		expect(result).toEqual({
			tag: 'failed',
			error: customError
		});
	});
});
