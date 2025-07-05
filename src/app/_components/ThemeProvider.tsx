import { ConfigProvider } from 'antd';
import type { FC, ReactNode } from 'react';
import { theme } from '@/styles/theme';

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<ConfigProvider
			theme={{
				token: {
					colorPrimary: theme.colors.primary,
					colorText: theme.colors.textPrimary,
					colorTextSecondary: theme.colors.textSecondary,
					colorBgBase: theme.colors.background,
					colorBorder: theme.colors.border
				}
			}}
		>
			{children}
		</ConfigProvider>
	);
};
