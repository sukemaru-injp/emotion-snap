import { describe, it, expect } from 'vitest';
import { generateRandomId } from '../generateRandomId';

describe('generateRandomId', () => {
	it('should generate a random number between 6 and 10 digits', () => {
		for (let i = 0; i < 100; i++) {
			// Run the test multiple times for robustness
			const id = generateRandomId();
			expect(typeof id).toBe('number');
			expect(id).toBeGreaterThanOrEqual(100000); // 6 digits minimum
			expect(id).toBeLessThanOrEqual(9999999999); // 10 digits maximum
		}
	});
});
