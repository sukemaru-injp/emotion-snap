'use client';
import { Alert } from 'antd';
import type { FC, ReactNode } from 'react';

type Props = {
	description: ReactNode;
};
export const ErrorAlert: FC<Props> = ({ description }) => {
	return (
		<Alert message="Error" description={description} type="error" showIcon />
	);
};
