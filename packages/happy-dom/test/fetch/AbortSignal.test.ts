import AbortSignal from '../../src/fetch/AbortSignal.js';
import Event from '../../src/event/Event.js';
import { describe, it, expect } from 'vitest';
import * as PropertySymbol from '../../src/PropertySymbol.js';

describe('AbortSignal', () => {
	describe('[PropertySymbol.abort]()', () => {
		it('Aborts the signal.', () => {
			const signal = new AbortSignal();
			const reason = new Error('abort reason');
			let triggeredEvent: Event | null = null;

			signal.addEventListener('abort', (event: Event) => (triggeredEvent = event));

			signal[PropertySymbol.abort](reason);

			expect(signal.aborted).toBe(true);
			expect(signal.reason).toBe(reason);
			expect((<Event>(<unknown>triggeredEvent)).type).toBe('abort');
		});
	});

	describe('throwIfAborted()', () => {
		it('Throws an "AbortError" if the signal has been aborted.', () => {
			const signal = new AbortSignal();
			const reason = new Error('abort reason');

			expect(() => signal.throwIfAborted()).not.toThrow(reason);

			signal[PropertySymbol.abort](reason);

			expect(() => signal.throwIfAborted()).toThrow(reason);
		});
	});

	describe('AbortSignal.abort()', () => {
		it('Returns a new instance of AbortSignal.', () => {
			const reason = new Error('abort reason');
			const signal = AbortSignal.abort(reason);

			expect(signal.aborted).toBe(true);
			expect(signal.reason).toBe(reason);
		});
	});

	describe('AbortSignal[Symbol.toStringTag]', () => {
		it('Returns AbortSignal string.', () => {
			const description = 'AbortSignal';
			const signal = new AbortSignal();

			expect(signal[Symbol.toStringTag]).toBe(description);
		});
	});
});
