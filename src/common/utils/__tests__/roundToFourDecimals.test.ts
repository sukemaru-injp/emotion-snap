import { roundToFourDecimals } from '../roundToFourDecimals';

describe('roundToFourDecimals', () => {
	it('should round numbers to four decimal places', () => {
		expect(roundToFourDecimals(1.123456)).toBe(1.1235);
		expect(roundToFourDecimals(1.123454)).toBe(1.1235);
		expect(roundToFourDecimals(1.123449)).toBe(1.1234);
	});
});
