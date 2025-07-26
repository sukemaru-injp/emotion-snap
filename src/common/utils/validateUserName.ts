import { err, ok, type Result } from 'neverthrow';

// Reserved names that cannot be used as usernames
const RESERVED_NAMES = [
	// Application routes
	'admin',
	'api',
	'auth',
	'login',
	'mypage',
	'public',
	'event',
	// Common reserved words
	'contact',
	'support',
	'help',
	'about',
	'terms',
	'privacy',
	'policy',
	// System reserved words
	'root',
	'system',
	'www',
	'mail',
	'ftp',
	'blog',
	'shop',
	'user',
	'users',
	'account',
	'accounts',
	'profile',
	'profiles',
	'settings',
	'config',
	'configuration',
	// Additional security-related reserved words
	'test',
	'demo',
	'example',
	'sample',
	'admin1',
	'administrator',
	'mod',
	'moderator',
	'null',
	'undefined',
	'true',
	'false'
];

/**
 * Validates a username with comprehensive security checks
 * @param name - The username to validate
 * @returns Result with validated username or array of error messages
 */
export const validateUserName = (name: string): Result<string, string[]> => {
	const trimName = name.trim();
	const errors: string[] = [];

	// Basic validation
	if (!trimName) {
		errors.push('ユーザー名は必須です');
		return err(errors);
	}

	if (trimName.length > 20) {
		errors.push('ユーザー名は20文字以内で入力してください');
	}

	if (trimName.length < 2) {
		errors.push('ユーザー名は2文字以上で入力してください');
	}

	// Security validation
	if (trimName.startsWith('_')) {
		errors.push('アンダースコアで始まる名前は使用できません');
	}

	if (/^\d+$/.test(trimName)) {
		errors.push('数字のみの名前は使用できません');
	}

	// Reserved names check (case-insensitive)
	if (RESERVED_NAMES.includes(trimName.toLowerCase())) {
		errors.push('この名前は予約されているため使用できません');
	}

	// Character validation
	if (
		!/^[a-zA-Z0-9_\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+$/.test(trimName)
	) {
		errors.push(
			'ユーザー名には英数字、アンダースコア、ひらがな、カタカナ、漢字のみ使用できます'
		);
	}

	// Prevent consecutive underscores
	if (/__/.test(trimName)) {
		errors.push('連続するアンダースコアは使用できません');
	}

	// Prevent ending with underscore
	if (trimName.endsWith('_')) {
		errors.push('アンダースコアで終わる名前は使用できません');
	}

	return errors.length > 0 ? err(errors) : ok(trimName);
};

/**
 * Get the list of reserved names (for testing or display purposes)
 */
export const getReservedNames = (): readonly string[] => RESERVED_NAMES;
