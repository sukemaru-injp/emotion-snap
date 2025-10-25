import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { EventImage } from '../../types/EventImage';
import type { S3ObjectInfo } from '../../types/S3ObjectInfo';
import { RankingModal, type ScoreType } from '../RankingModal';

// Mock Ant Design components
vi.mock('antd', () => ({
	// biome-ignore lint/suspicious/noExplicitAny: This is a test mock
	Card: ({ children, title, extra, className }: any) => (
		<div data-testid="card" className={className}>
			<div data-testid="card-title">{title}</div>
			<div data-testid="card-extra">{extra}</div>
			<div data-testid="card-content">{children}</div>
		</div>
	),
	// biome-ignore lint/suspicious/noExplicitAny: This is a test mock
	Col: ({ children }: any) => <div data-testid="col">{children}</div>,
	// biome-ignore lint/suspicious/noExplicitAny: This is a test mock
	Image: ({ src, alt, className }: any) => (
		<img src={src} alt={alt} className={className} data-testid="image" />
	),
	// biome-ignore lint/suspicious/noExplicitAny: This is a test mock
	Modal: ({ children, open, onCancel, className }: any) =>
		open ? (
			<div data-testid="modal" className={className}>
				<button data-testid="modal-close" onClick={onCancel} type="button">
					Close
				</button>
				{children}
			</div>
		) : null,
	// biome-ignore lint/suspicious/noExplicitAny: This is a test mock
	Row: ({ children }: any) => <div data-testid="row">{children}</div>,
	Select: Object.assign(
		// biome-ignore lint/suspicious/noExplicitAny: This is a test mock
		({ value, onChange, children }: any) => (
			<select
				data-testid="score-select"
				value={value}
				onChange={(e) => onChange(e.target.value)}
			>
				{children}
			</select>
		),
		{
			// biome-ignore lint/suspicious/noExplicitAny: This is a test mock
			Option: ({ children, value: optionValue }: any) => (
				<option value={optionValue}>{children}</option>
			)
		}
	),
	Typography: {
		// biome-ignore lint/suspicious/noExplicitAny: This is a test mock
		Title: ({ children, className }: any) => (
			<h1 data-testid="title" className={className}>
				{children}
			</h1>
		),
		// biome-ignore lint/suspicious/noExplicitAny: This is a test mock
		Text: ({ children, strong, type, className, style }: any) => (
			<span
				data-testid="text"
				className={className}
				style={style}
				data-strong={strong}
				data-type={type}
			>
				{children}
			</span>
		)
	}
}));

// Mock react-icons
vi.mock('react-icons/fa', () => ({
	FaCrown: () => <span data-testid="crown-icon">👑</span>,
	FaStar: () => <span data-testid="star-icon">⭐</span>,
	FaTrophy: () => <span data-testid="trophy-icon">🏆</span>
}));

// Mock CSS modules
vi.mock('../_styles/RankingModal.module.css', () => ({
	default: {
		fullscreenModal: 'fullscreen-modal',
		rankHeader: 'rank-header',
		rankTitle: 'rank-title',
		sortControls: 'sort-controls',
		rankingCard: 'ranking-card',
		firstPlace: 'first-place',
		secondPlace: 'second-place',
		thirdPlace: 'third-place',
		cardTitle: 'card-title',
		rankInfo: 'rank-info',
		rankNumber: 'rank-number',
		scoreInfo: 'score-info',
		scoreValue: 'score-value',
		imageContainer: 'image-container'
	}
}));

// Mock theme
vi.mock('@/styles/theme', () => ({
	theme: {
		spacing: {
			xs: 4,
			sm: 8,
			md: 16,
			lg: 24,
			xl: 32
		},
		colors: {
			primary: '#1890ff'
		}
	}
}));

describe('RankingModal', () => {
	const mockImages: EventImage[] = [
		{
			id: 1,
			s3_key: 'image1.jpg',
			angry_score: 10,
			happy_score: 80,
			sad_score: 5,
			smile_score: 75,
			surprised_score: 20,
			user_name: 'Alice'
		},
		{
			id: 2,
			s3_key: 'image2.jpg',
			angry_score: 30,
			happy_score: 60,
			sad_score: 15,
			smile_score: 85,
			surprised_score: 10,
			user_name: 'Bob'
		},
		{
			id: 3,
			s3_key: 'image3.jpg',
			angry_score: 5,
			happy_score: 90,
			sad_score: 3,
			smile_score: 70,
			surprised_score: 25,
			user_name: 'Charlie'
		}
	];

	const mockObjects: S3ObjectInfo[] = [
		{
			key: 'image1.jpg',
			url: 'https://example.com/image1.jpg',
			size: 1024,
			lastModified: new Date()
		},
		{
			key: 'image2.jpg',
			url: 'https://example.com/image2.jpg',
			size: 2048,
			lastModified: new Date()
		},
		{
			key: 'image3.jpg',
			url: 'https://example.com/image3.jpg',
			size: 1536,
			lastModified: new Date()
		}
	];

	const defaultProps = {
		isOpen: true,
		onClose: vi.fn(),
		images: mockImages,
		objects: mockObjects,
		selectedScoreType: 'happy_score' as ScoreType,
		onScoreTypeChange: vi.fn()
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders modal when isOpen is true', () => {
		render(<RankingModal {...defaultProps} />);
		expect(screen.getByTestId('modal')).toBeInTheDocument();
		expect(screen.getByText('Emotion Ranking')).toBeInTheDocument();
	});

	it('does not render modal when isOpen is false', () => {
		render(<RankingModal {...defaultProps} isOpen={false} />);
		expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
	});

	it('calls onClose when close button is clicked', () => {
		const onClose = vi.fn();
		render(<RankingModal {...defaultProps} onClose={onClose} />);

		fireEvent.click(screen.getByTestId('modal-close'));
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it('sorts images by happy_score in descending order by default', () => {
		render(<RankingModal {...defaultProps} />);

		const titles = screen.getAllByTestId('card-title');

		// Charlie should be first (90 happy_score)
		// Alice should be second (80 happy_score)
		// Bob should be third (60 happy_score)
		expect(titles[0]).toHaveTextContent('Charlie');
		expect(titles[1]).toHaveTextContent('Alice');
		expect(titles[2]).toHaveTextContent('Bob');
	});

	it('displays rank icons correctly', () => {
		render(<RankingModal {...defaultProps} />);

		// First place should have crown icon
		expect(screen.getByTestId('crown-icon')).toBeInTheDocument();
		// Second place should have trophy icon (there are multiple trophy icons)
		expect(screen.getAllByTestId('trophy-icon')).toHaveLength(2); // Header + 2nd place
		// Third place should have star icon
		expect(screen.getByTestId('star-icon')).toBeInTheDocument();
	});

	it('applies correct CSS classes for ranking positions', () => {
		render(<RankingModal {...defaultProps} />);

		const cards = screen.getAllByTestId('card');

		// First place should have first-place class
		expect(cards[0]).toHaveClass('first-place');
		// Second place should have second-place class
		expect(cards[1]).toHaveClass('second-place');
		// Third place should have third-place class
		expect(cards[2]).toHaveClass('third-place');
	});

	it('displays scores correctly with points format', () => {
		render(<RankingModal {...defaultProps} />);

		// Charlie's happy_score should be displayed as 90 Points
		expect(screen.getByText('90 Points')).toBeInTheDocument();
		// Alice's happy_score should be displayed as 80 Points
		expect(screen.getByText('80 Points')).toBeInTheDocument();
		// Bob's happy_score should be displayed as 60 Points
		expect(screen.getByText('60 Points')).toBeInTheDocument();
	});

	it('displays rank numbers correctly', () => {
		render(<RankingModal {...defaultProps} />);

		expect(screen.getByText('#1')).toBeInTheDocument();
		expect(screen.getByText('#2')).toBeInTheDocument();
		expect(screen.getByText('#3')).toBeInTheDocument();
	});

	it('truncates score display to four decimal places without rounding', () => {
		const decimalProps = {
			...defaultProps,
			images: [
				{
					id: 4,
					s3_key: 'decimal.jpg',
					angry_score: null,
					happy_score: 12.345678,
					sad_score: null,
					smile_score: null,
					surprised_score: null,
					user_name: 'Decimal User'
				}
			],
			objects: [
				{
					key: 'decimal.jpg',
					url: 'https://example.com/decimal.jpg',
					size: 1234,
					lastModified: new Date()
				}
			]
		};

		render(<RankingModal {...decimalProps} />);

		expect(screen.getByText('12.3456 Points')).toBeInTheDocument();
	});

	it('calls onScoreTypeChange when score type is changed', () => {
		const onScoreTypeChange = vi.fn();
		render(
			<RankingModal {...defaultProps} onScoreTypeChange={onScoreTypeChange} />
		);

		const select = screen.getByTestId('score-select');
		fireEvent.change(select, { target: { value: 'smile_score' } });

		expect(onScoreTypeChange).toHaveBeenCalledWith('smile_score');
	});

	it('re-sorts images when score type changes', () => {
		const { rerender } = render(<RankingModal {...defaultProps} />);

		// Initially sorted by happy_score: Charlie (90), Alice (80), Bob (60)
		let titles = screen.getAllByTestId('card-title');
		expect(titles[0]).toHaveTextContent('Charlie');
		expect(titles[1]).toHaveTextContent('Alice');
		expect(titles[2]).toHaveTextContent('Bob');

		// Change to smile_score: Bob (85), Alice (75), Charlie (70)
		rerender(
			<RankingModal {...defaultProps} selectedScoreType="smile_score" />
		);

		titles = screen.getAllByTestId('card-title');
		expect(titles[0]).toHaveTextContent('Bob');
		expect(titles[1]).toHaveTextContent('Alice');
		expect(titles[2]).toHaveTextContent('Charlie');
	});

	it('handles images with null scores correctly', () => {
		const imagesWithNullScores: EventImage[] = [
			{
				id: 1,
				s3_key: 'image1.jpg',
				angry_score: null,
				happy_score: null,
				sad_score: null,
				smile_score: null,
				surprised_score: null,
				user_name: 'Test User'
			}
		];

		const objectsWithNullScores: S3ObjectInfo[] = [
			{
				key: 'image1.jpg',
				url: 'https://example.com/image1.jpg',
				size: 1024,
				lastModified: new Date()
			}
		];

		render(
			<RankingModal
				{...defaultProps}
				images={imagesWithNullScores}
				objects={objectsWithNullScores}
			/>
		);

		// Should display 0 Points for null scores
		expect(screen.getByText('0 Points')).toBeInTheDocument();
	});

	it('displays images with correct src and alt attributes', () => {
		render(<RankingModal {...defaultProps} />);

		const images = screen.getAllByTestId('image');

		expect(images[0]).toHaveAttribute('src', 'https://example.com/image3.jpg');
		expect(images[0]).toHaveAttribute('alt', 'Charlie');
		expect(images[1]).toHaveAttribute('src', 'https://example.com/image1.jpg');
		expect(images[1]).toHaveAttribute('alt', 'Alice');
		expect(images[2]).toHaveAttribute('src', 'https://example.com/image2.jpg');
		expect(images[2]).toHaveAttribute('alt', 'Bob');
	});

	it('filters out images without metadata', () => {
		const incompleteObjects: S3ObjectInfo[] = [
			...mockObjects,
			{
				key: 'nonexistent.jpg',
				url: 'https://example.com/nonexistent.jpg',
				size: 1024,
				lastModified: new Date()
			}
		];

		render(<RankingModal {...defaultProps} objects={incompleteObjects} />);

		// Should only render 3 cards (not 4) since nonexistent.jpg has no metadata
		const cards = screen.getAllByTestId('card');
		expect(cards).toHaveLength(3);
	});
});
