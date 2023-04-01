import Event from '../../src/event/Event';
import AbortController from '../../src/fetch/AbortController';

describe('AbortController', () => {
	describe('abort()', () => {
		it('Aborts the signal.', () => {
			const controller = new AbortController();
			const signal = controller.signal;
			const reason = 'abort reason';
			let triggeredEvent: Event | null = null;

			signal.addEventListener('abort', (event: Event) => (triggeredEvent = event));

			controller.abort(reason);

			expect(signal.aborted).toBe(true);
			expect(signal.reason).toBe(reason);
			expect(triggeredEvent.type).toBe('abort');
		});
	});
});
