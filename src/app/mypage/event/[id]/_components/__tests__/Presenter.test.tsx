import type { Event } from '@/common/types/Event';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Presenter } from '../Presenter';

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
		render(<Presenter event={mockEvent} />);
		// Check if the event name is rendered
		// Ant Design Descriptions renders label and content in separate elements.
		// We need to find the element containing the event name.
		expect(screen.getByText(mockEvent.name)).toBeInTheDocument();
	});

	it('should display the event code', () => {
		render(<Presenter event={mockEvent} />);
		// Check if the event code is rendered
		expect(screen.getByText(mockEvent.code)).toBeInTheDocument();
	});

	it('should display the event date', () => {
		render(<Presenter event={mockEvent} />);
		expect(screen.getByText(mockEvent.date ?? 'Not set')).toBeInTheDocument();
	});

	it('should display "Not set" if date is null', () => {
		// Create a new object for this test case to avoid modifying mockEvent
		const eventWithoutDate: Event = { ...mockEvent, date: null };
		render(<Presenter event={eventWithoutDate} />);
		expect(screen.getByText('Not set')).toBeInTheDocument();
	});
});
