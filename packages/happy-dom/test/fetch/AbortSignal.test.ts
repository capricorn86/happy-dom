import Event from '../../src/event/Event.js';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import BrowserWindow from '../../src/window/BrowserWindow.js';
import Window from '../../src/window/Window.js';
import DOMException from '../../src/exception/DOMException.js';

describe('AbortSignal', () => {
	let window: BrowserWindow;

	beforeEach(() => {
		window = new Window();
	});

	describe('[PropertySymbol.abort]()', () => {
		it('Aborts the signal.', () => {
			const signal = new window.AbortSignal();
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
			const signal = new window.AbortSignal();
			const reason = new Error('abort reason');

			expect(() => signal.throwIfAborted()).not.toThrow(reason);

			signal[PropertySymbol.abort](reason);

			expect(() => signal.throwIfAborted()).toThrow(reason);
		});
	});

	describe('AbortSignal.abort()', () => {
		it('Returns a new instance of AbortSignal.', () => {
			const reason = new Error('abort reason');
			const signal = window.AbortSignal.abort(reason);

			expect(signal.aborted).toBe(true);
			expect(signal.reason).toBe(reason);
		});

		it('Returns a new instance of AbortSignal with a default reason if no reason is provided.', () => {
			const signal = window.AbortSignal.abort();

			expect(signal.aborted).toBe(true);
			expect(signal.reason instanceof window.DOMException).toBe(true);
			expect(signal.reason.message).toBe('signal is aborted without reason');
			expect(signal.reason.name).toBe('AbortError');
		});

		it('Returns a new instance of AbortSignal with a custom reason 1.', () => {
			const signal = window.AbortSignal.abort(1);

			expect(signal.aborted).toBe(true);
			expect(signal.reason instanceof Error).toBe(false);
			expect(signal.reason).toBe(1);
		});

		it('Returns a new instance of AbortSignal with a custom reason null.', () => {
			const signal = window.AbortSignal.abort(null);

			expect(signal.aborted).toBe(true);
			expect(signal.reason instanceof Error).toBe(false);
			expect(signal.reason).toBe(null);
		});
	});

	describe('AbortSignal.timeout()', () => {
		it('Returns a new instance of AbortSignal that aborts with a "TimeoutError" after a timeout.', async () => {
			const signal = window.AbortSignal.timeout(10);

			expect(signal.aborted).toBe(false);

			await new Promise((resolve) => setTimeout(resolve, 100));

			expect(signal.aborted).toBe(true);
			expect(signal.reason).toBeInstanceOf(window.DOMException);
			expect(signal.reason?.message).toBe('signal timed out');
			expect(signal.reason?.name).toBe('TimeoutError');
		});
	});

	describe('AbortSignal.any()', () => {
		it('Returns a signal that is asynchronously aborted when one of the supplied signals is asynchronously aborted.', () => {
			const signal1 = new window.AbortSignal();
			const signal2 = new window.AbortSignal();
			const signal = window.AbortSignal.any([signal1, signal2]);

			expect(signal.aborted).toBe(false);

			const reason2 = new Error('abort reason 2');
			signal2[PropertySymbol.abort](reason2);
			const reason1 = new Error('abort reason 1');
			signal1[PropertySymbol.abort](reason1);

			expect(signal.aborted).toBe(true);
			expect(signal.reason).toBe(reason2);
		});

		it('Returns a signal that is already aborted when one of the supplied signals is already aborted.', () => {
			const signal1 = new window.AbortSignal();
			const signal2 = new window.AbortSignal();

			const reason2 = new Error('abort reason 2');
			signal2[PropertySymbol.abort](reason2);

			const signal = window.AbortSignal.any([signal1, signal2]);

			expect(signal.aborted).toBe(true);
			expect(signal.reason).toBe(reason2);
		});
	});

	describe('AbortSignal[Symbol.toStringTag]', () => {
		it('Returns AbortSignal string.', () => {
			const description = 'AbortSignal';
			const signal = new window.AbortSignal();

			expect(signal[Symbol.toStringTag]).toBe(description);
		});
	});
});
