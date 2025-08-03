export const theme = {
	colors: {
		primary: '#F78C3D', // オレンジグラデーションベース
		primaryLight: '#FFD4A3', // 明るめオレンジ
		background: '#FFF8F2', // 優しいアイボリー
		textPrimary: '#333333', // メインテキスト（濃いグレー）
		textSecondary: '#666666', // サブテキスト
		border: '#E0E0E0', // 枠線カラー
		success: '#52c41a' // 成功メッセージ用グリーン
	} as const,
	spacing: {
		xs: '4px',
		sm: '8px',
		md: '16px',
		lg: '24px',
		xl: '32px',
		xxl: '40px'
	} as const
};
