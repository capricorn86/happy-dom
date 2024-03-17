import Event from '../../src/event/Event.js';
import AbortController from '../../src/fetch/AbortController.js';
import { describe, it, expect } from 'vitest';

describe('AbortController', () => {
	describe('abort()', () => {
		it('Aborts the signal.', () => {
			const controller = new AbortController();
			const signal = controller.signal;
			const reason = new Error('abort reason');
			let triggeredEvent: Event | null = null;

			signal.addEventListener('abort', (event: Event) => (triggeredEvent = event));

			controller.abort(reason);

			expect(signal.aborted).toBe(true);
			expect(signal.reason).toBe(reason);
			expect((<Event>(<unknown>triggeredEvent)).type).toBe('abort');
		});
	});
});
