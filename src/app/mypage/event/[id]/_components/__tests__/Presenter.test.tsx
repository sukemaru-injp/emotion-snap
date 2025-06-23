import type { Event } from '@/common/types/Event';
import { render, screen } from '@testing-library/react';
import { Presenter } from '../Presenter';

vi.mock('next/navigation', () => {
	const actual = vi.importActual('next/navigation');
	return {
		...actual,
		useRouter: vi.fn(() => ({
			push: vi.fn()
		})),
		useSearchParams: vi.fn(() => ({
			get: vi.fn()
		})),
		usePathname: vi.fn()
	};
});

// Mock Event data
const mockEvent: Event = {
	id: 123,
	name: 'Test Event Name',
	code: 'TESTCODE123',
	date: '2025-05-06', // Example date
	createdAt: new Date().toISOString() // Added missing createdAt field
};

describe('Presenter Component for mypage/event/[id]', () => {
	it('should display the event name', () => {
		render(
			<Presenter
				event={mockEvent}
				usrId="usr123"
				showQR={false}
				s3Objects={[]}
			/>
		);
		// Check if the event name is rendered
		// Ant Design Descriptions renders label and content in separate elements.
		// We need to find the element containing the event name.
		expect(screen.getByText(mockEvent.name)).toBeInTheDocument();
	});

	it('should display the event code', () => {
		render(
			<Presenter
				event={mockEvent}
				usrId="usr123"
				showQR={false}
				s3Objects={[]}
			/>
		);
		// Check if the event code is rendered
		expect(screen.getByText(mockEvent.code)).toBeInTheDocument();
	});

	it('should display the event date', () => {
		render(
			<Presenter
				event={mockEvent}
				usrId="usr123"
				showQR={false}
				s3Objects={[]}
			/>
		);
		expect(screen.getByText(mockEvent.date ?? 'Not set')).toBeInTheDocument();
	});

	it('should display "Not set" if date is null', () => {
		// Create a new object for this test case to avoid modifying mockEvent
		const eventWithoutDate: Event = { ...mockEvent, date: null };
		render(
			<Presenter
				event={eventWithoutDate}
				usrId="usr123"
				showQR={false}
				s3Objects={[]}
			/>
		);
		expect(screen.getByText('Not set')).toBeInTheDocument();
	});
});
