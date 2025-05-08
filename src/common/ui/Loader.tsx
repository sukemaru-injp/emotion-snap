'use client';
import { Spin } from 'antd';
import type { ReactNode } from 'react';

type Props = {
	children?: ReactNode;
	isLoading?: boolean;
	tip?: string;
};

export const Loader = ({ children, isLoading, tip }: Props) => {
	return (
		<Spin spinning={isLoading} tip={tip}>
			{children}
		</Spin>
	);
};
