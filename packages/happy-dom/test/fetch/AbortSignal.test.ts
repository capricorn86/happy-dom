import Event from '../../src/event/Event.js';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import BrowserWindow from '../../src/window/BrowserWindow.js';
import Window from '../../src/window/Window.js';

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
	});

	describe('AbortSignal.timeout()', () => {
		beforeEach(() => {
			vi.useFakeTimers();
		});

		afterEach(() => {
			vi.useRealTimers();
		});

		it('Returns a new instance of AbortSignal that aborts with a "TimeoutError" after a timeout.', () => {
			const signal = window.AbortSignal.timeout(100);

			expect(signal.aborted).toBe(false);

			vi.advanceTimersByTime(100);

			expect(signal.aborted).toBe(true);
			expect(signal.reason).toBeInstanceOf(DOMException);
			expect(signal.reason?.name).toBe('TimeoutError');
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
