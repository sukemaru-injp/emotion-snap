// Function to generate a random integer between min (inclusive) and max (inclusive)
// Ensures the number has between 6 and 10 digits.
export function generateRandomId(): number {
	const min = 100000; // 6 digits
	const max = 9999999999; // 10 digits
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
