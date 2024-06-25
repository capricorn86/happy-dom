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

	describe('AbortSignal.any()', () => {
		it('Returns a signal that is asynchronously aborted when one of the supplied signals is asynchronously aborted.', () => {
			const signal1 = new AbortSignal();
			const signal2 = new AbortSignal();
			const signal = AbortSignal.any([signal1, signal2]);

			expect(signal.aborted).toBe(false);

			const reason2 = new Error('abort reason 2');
			signal2[PropertySymbol.abort](reason2);
			const reason1 = new Error('abort reason 1');
			signal1[PropertySymbol.abort](reason1);

			expect(signal.aborted).toBe(true);
			expect(signal.reason).toBe(reason2);
		});

		it('Returns a signal that is already aborted when one of the supplied signals is already aborted.', () => {
			const signal1 = new AbortSignal();
			const signal2 = new AbortSignal();

			const reason2 = new Error('abort reason 2');
			signal2[PropertySymbol.abort](reason2);

			const signal = AbortSignal.any([signal1, signal2]);

			expect(signal.aborted).toBe(true);
			expect(signal.reason).toBe(reason2);
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
