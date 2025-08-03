import { describe, expect, it } from 'vitest';
import { getReservedNames, validateUserName } from '../validateUserName';

describe('validateUserName', () => {
	describe('Basic validation', () => {
		it('should reject empty string', () => {
			const result = validateUserName('');
			expect(result.isErr()).toBe(true);
			if (result.isErr()) {
				expect(result.error).toContain('ユーザー名は必須です');
			}
		});

		it('should reject whitespace only', () => {
			const result = validateUserName('   ');
			expect(result.isErr()).toBe(true);
			if (result.isErr()) {
				expect(result.error).toContain('ユーザー名は必須です');
			}
		});

		it('should reject names longer than 20 characters', () => {
			const result = validateUserName('a'.repeat(21));
			expect(result.isErr()).toBe(true);
			if (result.isErr()) {
				expect(result.error).toContain(
					'ユーザー名は20文字以内で入力してください'
				);
			}
		});

		it('should reject names shorter than 2 characters', () => {
			const result = validateUserName('a');
			expect(result.isErr()).toBe(true);
			if (result.isErr()) {
				expect(result.error).toContain(
					'ユーザー名は2文字以上で入力してください'
				);
			}
		});

		it('should accept valid names', () => {
			const result = validateUserName('validUser');
			expect(result.isOk()).toBe(true);
			if (result.isOk()) {
				expect(result.value).toBe('validUser');
			}
		});
	});

	describe('Security validation', () => {
		it('should reject names starting with underscore', () => {
			const result = validateUserName('_admin');
			expect(result.isErr()).toBe(true);
			if (result.isErr()) {
				expect(result.error).toContain(
					'アンダースコアで始まる名前は使用できません'
				);
			}
		});

		it('should reject names ending with underscore', () => {
			const result = validateUserName('admin_');
			expect(result.isErr()).toBe(true);
			if (result.isErr()) {
				expect(result.error).toContain(
					'アンダースコアで終わる名前は使用できません'
				);
			}
		});

		it('should reject consecutive underscores', () => {
			const result = validateUserName('user__name');
			expect(result.isErr()).toBe(true);
			if (result.isErr()) {
				expect(result.error).toContain(
					'連続するアンダースコアは使用できません'
				);
			}
		});

		it('should reject numeric-only names', () => {
			const result = validateUserName('123456');
			expect(result.isErr()).toBe(true);
			if (result.isErr()) {
				expect(result.error).toContain('数字のみの名前は使用できません');
			}
		});

		it('should accept names with mixed alphanumeric', () => {
			const result = validateUserName('user123');
			expect(result.isOk()).toBe(true);
		});

		it('should accept single underscore in middle', () => {
			const result = validateUserName('user_name');
			expect(result.isOk()).toBe(true);
		});
	});

	describe('Reserved names validation', () => {
		it('should reject reserved application routes', () => {
			const reservedRoutes = [
				'admin',
				'api',
				'auth',
				'login',
				'mypage',
				'public',
				'event'
			];

			for (const name of reservedRoutes) {
				const result = validateUserName(name);
				expect(result.isErr()).toBe(true);
				if (result.isErr()) {
					expect(result.error).toContain(
						'この名前は予約されているため使用できません'
					);
				}
			}
		});

		it('should reject reserved names case-insensitively', () => {
			const result = validateUserName('ADMIN');
			expect(result.isErr()).toBe(true);
			if (result.isErr()) {
				expect(result.error).toContain(
					'この名前は予約されているため使用できません'
				);
			}
		});

		it('should reject common reserved words', () => {
			const commonReserved = [
				'contact',
				'support',
				'help',
				'about',
				'root',
				'system'
			];

			for (const name of commonReserved) {
				const result = validateUserName(name);
				expect(result.isErr()).toBe(true);
				if (result.isErr()) {
					expect(result.error).toContain(
						'この名前は予約されているため使用できません'
					);
				}
			}
		});
	});

	describe('Character validation', () => {
		it('should accept English alphanumeric characters', () => {
			const result = validateUserName('testUser123');
			expect(result.isOk()).toBe(true);
		});

		it('should accept Japanese characters', () => {
			const result = validateUserName('テストユーザー');
			expect(result.isOk()).toBe(true);
		});

		it('should accept mixed Japanese and English', () => {
			const result = validateUserName('ユーザー123');
			expect(result.isOk()).toBe(true);
		});

		it('should reject special characters', () => {
			const invalidChars = [
				'user@name',
				'user-name',
				'user.name',
				'user#name',
				'user%name'
			];

			for (const name of invalidChars) {
				const result = validateUserName(name);
				expect(result.isErr()).toBe(true);
				if (result.isErr()) {
					expect(result.error).toContain(
						'ユーザー名には英数字、アンダースコア、ひらがな、カタカナ、漢字のみ使用できます'
					);
				}
			}
		});
	});

	describe('Multiple errors', () => {
		it('should return multiple validation errors', () => {
			const result = validateUserName('_test_'); // starts with _, ends with _
			expect(result.isErr()).toBe(true);
			if (result.isErr()) {
				expect(result.error.length).toBeGreaterThan(1);
				expect(result.error).toContain(
					'アンダースコアで始まる名前は使用できません'
				);
				expect(result.error).toContain(
					'アンダースコアで終わる名前は使用できません'
				);
			}
		});
	});

	describe('Trimming', () => {
		it('should trim whitespace from valid names', () => {
			const result = validateUserName('  validUser  ');
			expect(result.isOk()).toBe(true);
			if (result.isOk()) {
				expect(result.value).toBe('validUser');
			}
		});
	});
});

describe('getReservedNames', () => {
	it('should return readonly array of reserved names', () => {
		const reserved = getReservedNames();
		expect(Array.isArray(reserved)).toBe(true);
		expect(reserved.length).toBeGreaterThan(0);
		expect(reserved).toContain('admin');
		expect(reserved).toContain('api');
		expect(reserved).toContain('auth');
	});
});
