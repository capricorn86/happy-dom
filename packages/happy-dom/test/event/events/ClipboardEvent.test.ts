import ClipboardEvent from '../../../src/event/events/ClipboardEvent.js';
import DataTransfer from '../../../src/event/DataTransfer.js';
import { describe, it, expect } from 'vitest';

describe('ClipboardEvent', () => {
	describe('constructor()', () => {
		it('Creates a ClipboardEvent', () => {
			const eventType = 'paste';
			const event = new ClipboardEvent(eventType);
			expect(event.type).toBe(eventType);
			expect(event.clipboardData).toBeNull();
		});

		it('Creates a CustomEvent with clipboardData', () => {
			const eventType = 'paste';
			const clipboardData = new DataTransfer();
			const event = new ClipboardEvent(eventType, { clipboardData });
			expect(event.type).toBe(eventType);
			expect(event.clipboardData).toBe(clipboardData);
		});
	});
});
