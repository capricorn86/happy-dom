import PromiseRejectionEvent from '../../../src/event/events/PromiseRejectionEvent.js';
import { Window } from '../../../src/index.js';
import { describe, it, expect } from 'vitest';

describe('PromiseRejectionEvent', () => {
	describe('constructor()', () => {
		it('Creates a PromiseRejectionEvent with promise and reason', () => {
			const promise = Promise.reject('test error').catch(() => {});
			const reason = new Error('Something went wrong');
			const event = new PromiseRejectionEvent('unhandledrejection', {
				promise,
				reason,
				bubbles: true,
				cancelable: true
			});

			expect(event.type).toBe('unhandledrejection');
			expect(event.promise).toBe(promise);
			expect(event.reason).toBe(reason);
			expect(event.bubbles).toBe(true);
			expect(event.cancelable).toBe(true);
		});

		it('Creates a PromiseRejectionEvent without reason', () => {
			const promise = Promise.reject('test').catch(() => {});
			const event = new PromiseRejectionEvent('rejectionhandled', { promise });

			expect(event.type).toBe('rejectionhandled');
			expect(event.promise).toBe(promise);
			expect(event.reason).toBeUndefined();
		});
	});

	describe('Window.PromiseRejectionEvent', () => {
		it('Is available on the Window object', () => {
			const window = new Window();
			expect(window.PromiseRejectionEvent).toBe(PromiseRejectionEvent);
		});
	});
});
