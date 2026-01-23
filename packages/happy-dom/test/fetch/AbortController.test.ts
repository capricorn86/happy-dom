import Event from '../../src/event/Event.js';
import AbortController from '../../src/fetch/AbortController.js';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import BrowserWindow from '../../src/window/BrowserWindow.js';
import Window from '../../src/window/Window.js';

describe('AbortController', () => {
	let window: BrowserWindow;

	beforeEach(() => {
		window = new Window();
	});

	describe('abort()', () => {
		it('Aborts the signal.', () => {
			const controller = new window.AbortController();
			const signal = controller.signal;
			const reason = new Error('abort reason');
			let triggeredEvent: Event | null = null;

			signal.addEventListener('abort', (event: Event) => (triggeredEvent = event));

			controller.abort(reason);

			expect(signal.aborted).toBe(true);
			expect(signal.reason).toBe(reason);
			expect((<Event>(<unknown>triggeredEvent)).type).toBe('abort');
		});

		it('Does not trigger abort event listener if the listener signal is aborted', () => {
			const controller = new window.AbortController();
			const callbackCtrl = new window.AbortController();
			const signal = controller.signal;
			const callbackMock = vi.fn();

			signal.addEventListener('abort', (event: Event) => callbackMock(), {
				signal: callbackCtrl.signal
			});

			callbackCtrl.abort();
			controller.abort();

			expect(signal.aborted).toBe(true);
			expect(callbackMock).toBeCalledTimes(0);
		});
	});
});
