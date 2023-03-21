import AbortSignal from '../../src/fetch/AbortSignal';
import Event from '../../src/event/Event';

describe('AbortSignal', () => {
	describe('_abort()', () => {
		it('Aborts the signal.', async () => {
			const signal = new AbortSignal();
			const reason = 'abort reason';
			let triggeredEvent: Event | null = null;

			signal.addEventListener('abort', (event: Event) => (triggeredEvent = event));

			signal._abort(reason);

			expect(signal.aborted).toBe(true);
			expect(signal.reason).toBe(reason);
			expect(triggeredEvent.type).toBe('abort');
		});
	});

	describe('AbortSignal.abort()', () => {
		it('Returns a new instance of AbortSignal.', async () => {
			const reason = 'abort reason';
			const signal = AbortSignal.abort(reason);

			expect(signal.aborted).toBe(true);
			expect(signal.reason).toBe(reason);
		});
	});
});
