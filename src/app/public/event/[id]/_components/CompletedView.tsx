import { Card, Typography } from 'antd';
import { FaCheckCircle } from 'react-icons/fa';
import { theme } from '@/styles/theme';
import styles from './_styles/Presenter.module.css';

type Props = {
	eventName: string;
};

export const CompletedView: React.FC<Props> = ({ eventName }) => {
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<Typography.Title level={1} className={styles.title}>
					📸 {eventName}
				</Typography.Title>
			</div>
			<Card className={styles.card}>
				<div className={styles.cardContent}>
					<div className={styles.completionSection}>
						<FaCheckCircle color={theme.colors.success} size={64} />
						<Typography.Title level={2} className={styles.completionTitle}>
							投稿完了！
						</Typography.Title>
						<Typography.Text className={styles.completionMessage}>
							写真の投稿に成功しました。
							<br />
							このページを閉じてください。
						</Typography.Text>
					</div>
				</div>
			</Card>
		</div>
	);
};
