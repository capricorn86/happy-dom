import AbortSignal from '../../src/fetch/AbortSignal.js';
import Event from '../../src/event/Event.js';
import { describe, it, expect } from 'vitest';

describe('AbortSignal', () => {
	describe('_abort()', () => {
		it('Aborts the signal.', () => {
			const signal = new AbortSignal();
			const reason = 'abort reason';
			let triggeredEvent: Event | null = null;

			signal.addEventListener('abort', (event: Event) => (triggeredEvent = event));

			signal._abort(reason);

			expect(signal.aborted).toBe(true);
			expect(signal.reason).toBe(reason);
			expect((<Event>(<unknown>triggeredEvent)).type).toBe('abort');
		});
	});

	describe('AbortSignal.abort()', () => {
		it('Returns a new instance of AbortSignal.', () => {
			const reason = 'abort reason';
			const signal = AbortSignal.abort(reason);

			expect(signal.aborted).toBe(true);
			expect(signal.reason).toBe(reason);
		});
	});
});
